import { ethers, BrowserProvider, Contract, JsonRpcSigner } from 'ethers';

// ERC-721 NFT Contract ABI (simplified)
export const NFT_CONTRACT_ABI = [
  'function mint(address to, string memory tokenURI) public returns (uint256)',
  'function transferFrom(address from, address to, uint256 tokenId) public',
  'function ownerOf(uint256 tokenId) public view returns (address)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'function setRoyalty(uint256 tokenId, uint96 feeNumerator) public',
  'function royaltyInfo(uint256 tokenId, uint256 salePrice) public view returns (address, uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Minted(address indexed to, uint256 indexed tokenId, string tokenURI)',
];

// Marketplace Contract ABI (simplified)
export const MARKETPLACE_CONTRACT_ABI = [
  'function listItem(address nftAddress, uint256 tokenId, uint256 price) public',
  'function buyItem(address nftAddress, uint256 tokenId) public payable',
  'function cancelListing(address nftAddress, uint256 tokenId) public',
  'function updateListing(address nftAddress, uint256 tokenId, uint256 newPrice) public',
  'event ItemListed(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price)',
  'event ItemSold(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 price)',
];

export class Web3Service {
  private provider: BrowserProvider | null = null;
  private signer: JsonRpcSigner | null = null;
  private nftContract: Contract | null = null;
  private marketplaceContract: Contract | null = null;

  async connect(): Promise<string> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      this.provider = new BrowserProvider(window.ethereum);
      const accounts = await this.provider.send('eth_requestAccounts', []);
      this.signer = await this.provider.getSigner();
      
      return accounts[0];
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  }

  async getNetwork() {
    if (!this.provider) throw new Error('Provider not initialized');
    return await this.provider.getNetwork();
  }

  async switchNetwork(chainId: number) {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // Chain not added to MetaMask
      if (error.code === 4902) {
        throw new Error('Please add this network to MetaMask');
      }
      throw error;
    }
  }

  initializeNftContract(contractAddress: string) {
    if (!this.signer) throw new Error('Signer not initialized');
    this.nftContract = new Contract(contractAddress, NFT_CONTRACT_ABI, this.signer);
    return this.nftContract;
  }

  initializeMarketplaceContract(contractAddress: string) {
    if (!this.signer) throw new Error('Signer not initialized');
    this.marketplaceContract = new Contract(contractAddress, MARKETPLACE_CONTRACT_ABI, this.signer);
    return this.marketplaceContract;
  }

  async mintNFT(to: string, tokenURI: string): Promise<{ tokenId: string; txHash: string }> {
    if (!this.nftContract) throw new Error('NFT contract not initialized');

    try {
      const tx = await this.nftContract.mint(to, tokenURI);
      const receipt = await tx.wait();
      
      // Extract tokenId from event logs
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.nftContract!.interface.parseLog(log);
          return parsed?.name === 'Minted';
        } catch {
          return false;
        }
      });

      let tokenId = '0';
      if (event) {
        const parsed = this.nftContract.interface.parseLog(event);
        tokenId = parsed?.args[1].toString() || '0';
      }

      return {
        tokenId,
        txHash: receipt.hash,
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }

  async listNFT(nftAddress: string, tokenId: string, price: string): Promise<string> {
    if (!this.marketplaceContract) throw new Error('Marketplace contract not initialized');

    try {
      const priceInWei = ethers.parseEther(price);
      const tx = await this.marketplaceContract.listItem(nftAddress, tokenId, priceInWei);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error listing NFT:', error);
      throw error;
    }
  }

  async buyNFT(nftAddress: string, tokenId: string, price: string): Promise<string> {
    if (!this.marketplaceContract) throw new Error('Marketplace contract not initialized');

    try {
      const priceInWei = ethers.parseEther(price);
      const tx = await this.marketplaceContract.buyItem(nftAddress, tokenId, {
        value: priceInWei,
      });
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error buying NFT:', error);
      throw error;
    }
  }

  async transferNFT(to: string, tokenId: string): Promise<string> {
    if (!this.nftContract || !this.signer) throw new Error('Contract or signer not initialized');

    try {
      const from = await this.signer.getAddress();
      const tx = await this.nftContract.transferFrom(from, to, tokenId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error transferring NFT:', error);
      throw error;
    }
  }

  async setRoyalty(tokenId: string, royaltyPercentage: number): Promise<string> {
    if (!this.nftContract) throw new Error('NFT contract not initialized');

    try {
      // Convert percentage to basis points (e.g., 10% = 1000)
      const feeNumerator = royaltyPercentage * 100;
      const tx = await this.nftContract.setRoyalty(tokenId, feeNumerator);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error setting royalty:', error);
      throw error;
    }
  }

  async estimateGas(method: string, ...args: any[]): Promise<bigint> {
    if (!this.nftContract) throw new Error('Contract not initialized');

    try {
      const gasEstimate = await this.nftContract[method].estimateGas(...args);
      // Add 20% buffer
      return (gasEstimate * BigInt(120)) / BigInt(100);
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }

  formatEther(wei: bigint): string {
    return ethers.formatEther(wei);
  }

  parseEther(ether: string): bigint {
    return ethers.parseEther(ether);
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.nftContract = null;
    this.marketplaceContract = null;
  }
}

export const web3Service = new Web3Service();

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
