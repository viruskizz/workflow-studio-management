export class Profile {
    public username: string;
    public imageUrl: string;

    constructor(username: string, imageUrl: string) {
        this.username = username;
        this.imageUrl = imageUrl;
    }
}