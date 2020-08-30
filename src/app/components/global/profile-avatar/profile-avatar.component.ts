import { Component, Input, OnInit } from '@angular/core';

enum AVATAR_SIZE {
    default = 'default',
    small = 'small'
}

interface Size {
    nameFontSizeClass: string;
    roleFontSizeClass: string;
}

interface Options {
    size: string;
    isBold: boolean;
    isEllipsis: boolean;
    isColorPrimary: boolean;
    isAlignedTop: boolean;
}

@Component({
    selector: 'profile-avatar',
    templateUrl: './profile-avatar.component.html',
    styleUrls: ['./profile-avatar.component.css']
})

export class ProfileAvatarComponent implements OnInit {
    public sizes: { [key: string]: Size } = {
        [AVATAR_SIZE.default]: {
            nameFontSizeClass: 'mat-title',
            roleFontSizeClass: 'mat-caption'
        },
        [AVATAR_SIZE.small]: {
            nameFontSizeClass: 'mat-body-2',
            roleFontSizeClass: 'mat-caption'
        }
    };

    @Input() imageSrc: string;

    @Input() name: string;
    @Input() securityRole: string;
    @Input() businessRole: string;
    @Input() status: string;
    @Input() size: AVATAR_SIZE;
    @Input() options: Options = {
        isBold: true,
        isColorPrimary: true,
        size: 'default',
        isEllipsis: true,
        isAlignedTop: false
    };

    public selectedSize: Size;

    ngOnInit() {
        this.selectedSize = this.sizes[this.options.size] || this.sizes.default;
    }
}
