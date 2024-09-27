export interface Partner {
  name: string;
  route: string;
  logo: string;
  url: string;
  description: string;
  social?: SocialMedia[];
}

export interface SocialMedia {
  name: string;
  icon: string;
  url: string;
}

export const PARTNERS: Partner[] = [
  {
    name: 'TechHub.bg',
    route: 'techhub',
    logo: '/assets/partners/Logo_Techhub_white.png',
    url: 'https://techhub.bg/',
    description: 'Infragistics is a global leader in UI and UX tools for developers.',
    social: [
      {
        name: 'Facebook',
        icon: 'facebook',
        url: 'https://www.facebook.com/techhub.bg'
      },
      {
        name: 'Instagram',
        icon: 'instagram',
        url: 'https://www.instagram.com/TechHub.bg'
      },
      {
        name: 'LinkedIn',
        icon: 'linkedin',
        url: 'https://www.linkedin.com/company/techhub-bg'
      },
      {
        name: 'TikTok',
        icon: 'tiktok',
        url: 'https://www.tiktok.com/@techhub.bg'
      }
    ]
  },
];
