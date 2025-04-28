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
      },
      {
        path: 'stackit', component: PartnerComponent, data: {
          title: 'Bellum Gens Partners: STACKIT',
          twitterTitle: 'Bellum Gens Partners: STACKIT',
          description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          name: 'STACKIT',
          url: 'https://www.stackit.de/en/',
          partnerImage: '/assets/partners/Sponsors-stackit.png',
          expose: [
            '🎉 We are thrilled to announce our partnership with STACKIT. 🎮✨',
            'STACKIT - THE SOVEREIGN CLOUD FOR EUROPE',
            'We are the cloud provider of Schwarz Group – Europe‘s largest retailer. We were born out of the need for maximum sovereignty. With our sovereign and secure solutions, we now support customers from all over Europe and you in your digital transformation. Our support teams operating in the EU can provide you with expert advice on all questions relating to migration, target architecture, cloud assessment and platform reengineering at any time.',
            'STACKIT offers you more than just the cloud. Together with a broad network of partners, we support you holistically with individual approaches to the operation and implementation of cloud solutions that perfectly suit your needs. If required, we also offer colocation services. As a provider based in the EU and exclusively using EU data centers, we strengthen your digital sovereignty to the maximum.',
            'TOWARDS DIGITAL INDEPENDENCE WITH STACKIT'
          ],
          social: [
            {
              name: 'Facebook',
              icon: 'facebook',
              url: 'https://www.facebook.com/schwarzitbg'
            },
            {
              name: 'Instagram',
              icon: 'instagram',
              url: 'https://www.instagram.com/schwarzit.bg/'
            },
            {
              name: 'LinkedIn',
              icon: 'linkedin',
              url: 'https://www.linkedin.com/company/schwarz-it-bulgaria/'
            }
          ]
        }
      },
      {
        path: 'pcbuild', component: PartnerComponent, data: {
          title: 'Bellum Gens Partners: PCBuild',
          twitterTitle: 'Bellum Gens Partners: PCBuild',
          description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          name: 'PCBuild',
          url: 'https://pcbuild.bg/',
          partnerImage: '/assets/partners/Sponsors-pcbuild.png',
          expose: [
            $localize`🎉 We are thrilled to announce our new strategic partnership with PCBuild! 🖥️✨`,
            $localize`PCBuild specializes in assembling high-performance gaming configurations and is dedicated to supporting Bellum Gens Elite Stara Zagora 2025 and the esports community by providing gamers with the highest quality equipment possible. With their cutting-edge technology, expertly built systems, and commitment to excellence, PCBuild empowers players to realize their full potential and achieve greatness in the competitive gaming world. 🎮🏆`,
            $localize`Together, we aim to elevate the esports experience and bring unparalleled performance to our players and fans!`
          ],
          social: [
            {
              name: 'Facebook',
              icon: 'facebook',
              url: 'https://www.facebook.com/pcbuildingbg/'
            },
            {
              name: 'Instagram',
              icon: 'instagram',
              url: 'https://www.instagram.com/pcbuild.bg/'
            },
            {
              name: 'YouTube',
              icon: 'youtube',
              url: 'https://www.youtube.com/channel/UCJDFgTEwJhFWG8zBB4Eghyg'
            },
            {
              name: 'Twitch',
              icon: 'twitch',
              url: 'https://www.twitch.tv/pcbuildbg'
            },
            {
              name: 'Discord',
              icon: 'discord',
              url: 'https://discord.com/invite/jKFQUxb'
            }
          ]
        }
      }
    ]
  },
];
