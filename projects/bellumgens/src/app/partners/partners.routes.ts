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
      },
      {
        path: 'healthygg', component: PartnerComponent, data: {
          title: 'Bellum Gens Partners: HealthyGG',
          twitterTitle: 'Bellum Gens Partners: HealthyGG',
          description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          name: 'HealthyGG',
          url: 'https://healthygg.org/',
          partnerImage: '/assets/partners/Sponsors-hgg.png',
          expose: [
            $localize`🎉🎓 Bellum Gens Elite Stara Zagora 2025 and HealthyGG Announce New Academic Research Partnership! 🖥️✨`,
            $localize`We are thrilled to announce an exciting new partnership between Bellum Gens Elite Stara Zagora 2025 and HealthyGG. This collaboration aims to integrate academic excellence with insights on performance, and broadcast technology. 🎮🏆⚕️`,
            $localize`During BGE Stara Zagora we will host Andrzej Białecki, a PhD student at Warsaw University of Technology, and previously Józef Piłsudski University of Physical Education in Warsaw. He strives to learn more about various aspects of esports, and how to inform players to become better.`,
            $localize`We will leverage a system designed to display the live heart rate of the players to see how they react to the in-game stimuli. This system was designed by Andrzej with assistance of Marcin Warda.`,
            $localize`The live capture system was first introduced at a Polish tournament by Daniel Grabka.`
          ],
          social: [
            {
              name: 'Twitter',
              icon: 'twitter',
              url: 'https://x.com/Kaszanas'
            },
            {
              name: 'Github',
              icon: 'github',
              url: 'https://github.com/Kaszanas'
            }
          ]
        }
      },
      {
        path: 'asrock', component: PartnerComponent, data: {
          title: 'Bellum Gens Partners: ASRock',
          twitterTitle: 'Bellum Gens Partners: ASRock',
          description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          name: 'ASRock',
          url: 'https://www.asrock.com/',
          partnerImage: '/assets/partners/Sponsors-asrock.png',
          expose: [
            $localize`🎉 We are thrilled to announce that ASRock has partnered with Bellum Gens Elite Stara Zagora 2025 to bring you an unforgettable esports experience! This collaboration marks a significant milestone in the world of competitive gaming, combining ASRock's cutting-edge technology with the high-energy atmosphere of Bellum Gens Elite. 🖥️✨`,
            $localize`About ASRock: Founded in 2002, ASRock Inc. is a leading Taiwanese manufacturer specializing in motherboards, industrial PCs, and home theater PCs (HTPC). Known for its innovative designs and high-quality products, ASRock has established itself as a major player in the global computer hardware industry. With a commitment to providing top-tier gaming solutions, ASRock's Phantom Gaming product line caters to gamers, professionals, and PC enthusiasts alike. 🎮🏆`,
            $localize`Together, ASRock and Bellum Gens Elite Stara Zagora 2025 aim to elevate the esports experience to new heights, providing gamers and fans with state-of-the-art technology and thrilling gameplay. Stay tuned for more updates and join us in celebrating this exciting partnership!`
          ],
          social: [
            {
              name: 'Facebook',
              icon: 'facebook',
              url: 'https://www.facebook.com/ASRockInfo'
            },
            {
              name: 'Instagram',
              icon: 'instagram',
              url: 'https://www.instagram.com/asrock_official/'
            },
            {
              name: 'YouTube',
              icon: 'youtube',
              url: 'https://www.youtube.com/@ASRockInfo'
            }
          ]
        }
      },
      {
        path: 'deepcool', component: PartnerComponent, data: {
          title: 'Bellum Gens Partners: DeepCool',
          twitterTitle: 'Bellum Gens Partners: DeepCool',
          description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          name: 'DeepCool',
          url: 'https://www.deepcool.com',
          partnerImage: '/assets/partners/Sponsors-deepcool.png',
          expose: [
            $localize`🎉 We are thrilled to announce a partnership between DeepCool, a leading innovator in computer hardware and cooling solutions, and Bellum Gens Elite Stara Zagora 2025, Bulgaria's premier esports event. 🖥️🥶✨`,
            $localize`About DeepCool: Founded in 1996 and headquartered in Beijing, DeepCool has been at the forefront of providing high-performance cooling parts and thermal solutions globally. With a commitment to innovation and quality, DeepCool's product range includes air and water CPU coolers, computer cases, power supplies, and various computer peripherals. Their dedication to sustainability and excellence is evident through their ISO14000 environmental management standards and continuous improvements in energy-saving and consumption reduction. 🎮🏆`,
            $localize`This partnership aims to enhance the esports experience by integrating DeepCool's cutting-edge technology with the thrilling competition of Bellum Gens Elite. Together, we are committed to pushing the boundaries of performance and entertainment, ensuring that both players and fans enjoy the best possible gaming environment.`
          ],
          social: [
            {
              name: 'YouTube',
              icon: 'youtube',
              url: 'https://www.youtube.com/@DeepcoolOfficial-1999/featured'
            },
            {
              name: 'Facebook',
              icon: 'facebook',
              url: 'https://www.facebook.com/deepcoolglobal'
            },
            {
              name: 'Twitter',
              icon: 'twitter',
              url: 'https://twitter.com/Deepcoolglobal'
            },
            {
              name: 'Instagram',
              icon: 'instagram',
              url: 'https://www.instagram.com/deepcoolofficial/'
            },
            {
              name: 'TikTok',
              icon: 'tiktok',
              url: 'https://www.tiktok.com/@deepcoolofficial'
            },
            {
              name: 'LinkedIn',
              icon: 'linkedin',
              url: 'https://www.linkedin.com/company/deepcool/'
            },
            {
              name: 'Discord',
              icon: 'discord',
              url: 'https://discord.com/invite/bqBgjpnh5d'
            }
          ]
        }
      }
    ]
  },
];
