import { ErrorHandler, Injectable } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AzureBlobStorageService {

    // Enter your storage account name
    storageAccount = environment.azureStorage.storageAccount;

    public upload(container: string, sas: string, content: Blob, name: string, handler: () => void) {
        this.uploadBlob(content, name, this.containerClient(container, sas), handler)
    }

    public list(container: string, sas: string): Promise<string[]> {
        return this.listBlobs(this.containerClient(container, sas))
    }

    public download(container: string, sas: string, name: string, handler: (blob: Blob) => void) {
        this.downloadBlob(name, this.containerClient(container, sas), handler)
    }

    public delete(container: string, sas: string, name: string, handler: () => void) {
        this.deleteBlob(name, this.containerClient(container, sas), handler)
    }

    public baseStorageURL() {
        const baseURL = `https://${this.storageAccount}.blob.core.windows.net`;
        return baseURL;
    };

    private uploadBlob(content: Blob, name: string, client: ContainerClient, handler: () => void) {
        let blockBlobClient = client.getBlockBlobClient(name);
        blockBlobClient.uploadData(content, { blobHTTPHeaders: { blobContentType: content.type } })
            .then(() => handler())
    }

    private async listBlobs(client: ContainerClient): Promise<string[]> {
        let result: string[] = []

        let blobs = client.listBlobsFlat();
        for await (const blob of blobs) {
            result.push(blob.name)
        }

        return result;
    }

    private downloadBlob(name: string, client: ContainerClient, handler: (blob: Blob) => void) {
        const blobClient = client.getBlobClient(name);
        blobClient.download().then(resp => {
            resp.blobBody.then(blob => {
                handler(blob)
            })
        })
    }

    private deleteBlob(name: string, client: ContainerClient, handler: () => void) {
        client.deleteBlob(name).then(() => {
            handler()
        })
    }

    private containerClient(container: string, sas: string): ContainerClient {
        return new BlobServiceClient(`https://${this.storageAccount}.blob.core.windows.net?${sas}`)
            .getContainerClient(container);
    }
}