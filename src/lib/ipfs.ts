import axios from 'axios';

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface IPFSMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  content?: string;
  category?: string;
  tags?: string[];
}

export class IPFSService {
  private apiKey: string;
  private secretKey: string;
  private gatewayUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
    this.secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '';
    this.gatewayUrl = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud';
  }

  private getHeaders() {
    return {
      pinata_api_key: this.apiKey,
      pinata_secret_api_key: this.secretKey,
    };
  }

  async uploadJSON(metadata: IPFSMetadata): Promise<string> {
    if (!this.apiKey || !this.secretKey) {
      console.warn('IPFS credentials not configured, using mock hash');
      // Return mock hash for development
      return `Qm${Math.random().toString(36).substring(2, 15)}`;
    }

    try {
      const response = await axios.post<PinataResponse>(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        { headers: this.getHeaders() }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw new Error('Failed to upload metadata to IPFS');
    }
  }

  async uploadFile(file: File): Promise<string> {
    if (!this.apiKey || !this.secretKey) {
      console.warn('IPFS credentials not configured, using mock hash');
      // Return mock hash for development
      return `Qm${Math.random().toString(36).substring(2, 15)}`;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<PinataResponse>(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  async uploadContent(content: string, filename: string = 'content.txt'): Promise<string> {
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], filename, { type: 'text/plain' });
    return this.uploadFile(file);
  }

  getGatewayUrl(ipfsHash: string): string {
    return `${this.gatewayUrl}/ipfs/${ipfsHash}`;
  }

  async fetchFromIPFS(ipfsHash: string): Promise<any> {
    try {
      const url = this.getGatewayUrl(ipfsHash);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching from IPFS:', error);
      throw new Error('Failed to fetch data from IPFS');
    }
  }

  async unpinFile(ipfsHash: string): Promise<boolean> {
    if (!this.apiKey || !this.secretKey) {
      return false;
    }

    try {
      await axios.delete(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
        headers: this.getHeaders(),
      });
      return true;
    } catch (error) {
      console.error('Error unpinning file:', error);
      return false;
    }
  }

  async createNFTMetadata(
    nft: {
      title: string;
      description: string;
      content: string;
      category?: string;
      tags?: string[];
      imageUrl?: string;
    }
  ): Promise<{ metadataHash: string; contentHash: string; imageHash?: string }> {
    try {
      // Upload content to IPFS
      const contentHash = await this.uploadContent(nft.content, `${nft.title}.txt`);

      // Upload image if provided
      let imageHash: string | undefined;
      let imageUrl = nft.imageUrl;

      if (imageUrl && imageUrl.startsWith('blob:')) {
        // If it's a blob URL, fetch and upload to IPFS
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'image.png', { type: blob.type });
        imageHash = await this.uploadFile(file);
        imageUrl = this.getGatewayUrl(imageHash);
      }

      // Create metadata object
      const metadata: IPFSMetadata = {
        name: nft.title,
        description: nft.description,
        image: imageUrl || '',
        content: this.getGatewayUrl(contentHash),
        category: nft.category,
        tags: nft.tags,
        attributes: [
          {
            trait_type: 'Category',
            value: nft.category || 'story',
          },
          {
            trait_type: 'Content Length',
            value: nft.content.length,
          },
        ],
      };

      // Upload metadata to IPFS
      const metadataHash = await this.uploadJSON(metadata);

      return {
        metadataHash,
        contentHash,
        imageHash,
      };
    } catch (error) {
      console.error('Error creating NFT metadata:', error);
      throw error;
    }
  }
}

export const ipfsService = new IPFSService();
