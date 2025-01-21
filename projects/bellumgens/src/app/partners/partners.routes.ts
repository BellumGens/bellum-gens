import { Routes } from '@angular/router';
import { PartnersComponent } from './partners.component';
import { PartnerComponent } from './partner/partner.component';

export const routes: Routes = [
  {
    path: '',
    component: PartnersComponent,
    data: {
      title: 'Bellum Gens Partners: Our partners and sponsors',
      twitterTitle: 'Bellum Gens Partners: Our partners and sponsors',
      description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
      twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.'
    },
    children: [
      { path: '', redirectTo: 'visit-stara-zagora', pathMatch: 'full' },
      // {
      //   path: 'techhub', component: PartnerComponent, data: {
      //     title: 'Bellum Gens Partners: TechHub.bg',
      //     twitterTitle: 'Bellum Gens Partners: TechHub.bg',
      //     description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
      //     twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
      //     name: 'TechHub.bg',
      //     url: 'https://techhub.bg',
      //     partnerImage: '/assets/partners/Sponsors-techhub.png',
      //     expose: [
      //       $localize`We are thrilled to announce a 3-year partnership between Bellum Gens Elite Stara Zagora and TechHub.bg! 🤝`,
      //       $localize`TechHub.bg makes tech shopping both easy and inspiring! With a wide range of high-quality products for home and office, they build a trusted community of enthusiasts and professionals. Your satisfaction is their top priority – discover the difference with TechHub.bg!`,
      //       $localize`Together, we are committed to fostering the growth and development of esports in our region. This collaboration will bring new opportunities, events, and initiatives to support our vibrant gaming community. 🎮✨`
      //     ],
      //     social: [
      //       {
      //         name: 'Facebook',
      //         icon: 'facebook',
      //         url: 'https://www.facebook.com/techhub.bg'
      //       },
      //       {
      //         name: 'Instagram',
      //         icon: 'instagram',
      //         url: 'https://www.instagram.com/TechHub.bg'
      //       },
      //       {
      //         name: 'LinkedIn',
      //         icon: 'linkedin',
      //         url: 'https://www.linkedin.com/company/techhub-bg'
      //       },
      //       {
      //         name: 'TikTok',
      //         icon: 'tiktok',
      //         url: 'https://www.tiktok.com/@techhub.bg'
      //       }
      //     ]
      //   }
      // },
      {
        path: 'visit-stara-zagora', component: PartnerComponent, data: {
          title: 'Bellum Gens Partners: Visit Stara Zagora',
          twitterTitle: 'Bellum Gens Partners: Visit Stara Zagora',
          description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          name: 'Visit Stara Zagora',
          url: 'https://visitstarazagora.bg/',
          partnerImage: '/assets/partners/Sponsors-visit-stz.png',
          expose: [
            $localize`🌟We are thrilled to present Visit Stara Zagora as the main official partner of Bellum Gens Elite Stara Zagora! This partnership marks a significant step forward in enhancing the development of esports in Bulgaria and raising awareness of Stara Zagora as a premier esports destination in the country.🌟`,
            $localize`Stara Zagora is a real treasure trove for researchers. Here you can walk around the home of people who lived 8,000 years ago, walk along a fully preserved ancient street of the Roman city of Augusta Trayana, feel the spirit of the Renaissance and embark on many other exploratory missions. The city is extremely convenient for visiting and walking with an organized group.`,
            $localize`Together, we aim to create a vibrant esports community and provide unparalleled opportunities for gamers and fans alike. 🎮`
          ],
          social: [
            {
              name: 'Facebook',
              icon: 'facebook',
              url: 'https://www.facebook.com/visitstarazagora.bg'
            },
            {
              name: 'Instagram',
              icon: 'instagram',
              url: 'https://www.instagram.com/visitstarazagora/'
            },
            {
              name: 'TikTok',
              icon: 'tiktok',
              url: 'https://www.tiktok.com/@visit.starazagora'
            }
          ]
        }
      },
      {
        path: 'bulstream', component: PartnerComponent, data: {
          title: 'Bellum Gens Partners: BulStream',
          twitterTitle: 'Bellum Gens Partners: BulStream',
          description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          name: 'BulStream',
          url: 'https://bulstream.com',
          partnerImage: '/assets/partners/Sponsors-bulstream.png',
          expose: [
            $localize`🎉We are thrilled to announce that BulStream is the official production partner of Bellum Gens Elite Stara Zagora! 🏆 BulStream has exclusively secured production for all events hosted by Bellum Gens - Esports Business League and Bellum Gens Elite.`,
            $localize`With their world-class production capabilities and exceptional live streaming services, BulStream is dedicated to delivering the highest quality esports experience to all viewers. Get ready for an unparalleled esports journey! 🎮✨`,
            $localize`Together, we aim to achieve top-tier production quality and deliver the ultimate esports experience for both players and audiences! 🚀`
          ],
          social: [
            {
              name: 'Facebook',
              icon: 'facebook',
              url: 'https://www.facebook.com/bulstream'
            },
            {
              name: 'Instagram',
              icon: 'instagram',
              url: 'https://www.instagram.com/bulstreamcom/'
            },
            {
              name: 'LinkedIn',
              icon: 'linkedin',
              url: 'https://www.linkedin.com/company/bulstream'
            }
          ]
        }
      }
    ]
  },
];
