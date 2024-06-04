import { Injectable } from "@angular/core";
import { Profile } from "../models/profile.model";

@Injectable()
export class ProfileService {
    private profiles: Profile[] = [
        new Profile(
            'Plaimee',
            ''
        ),
        new Profile(
            'Piyanut',
            'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'
        )
    ];

    getProfiles() {
        return this.profiles.slice();
    }

    getProfile(index: number) {
        return this.profiles.slice()[index];
    }
}