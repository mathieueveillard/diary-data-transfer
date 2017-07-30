# diary
A Web application implementing an online private diary with a textual search feature.


## Purpose
It is true, one could write their diary with their favorite text editor, having let's say one file per year. But what about finding all the entries you wrote during 10 years on a specific topic ? This is the very functionality that *diary* intends to provide us with.


## Main functionalities
* Continuous save while editing
* Infinite scrolling
* Textual search (french context)
* Support of [Markdown (GFM)](https://guides.github.com/features/mastering-markdown/)
* Minimal, responsive design
* Keyboard management


## Architecture
* [CycleJS](https://cycle.js.org/), xstream (~[RxJS](http://reactivex.io/)), OAuth2 (spa)
* [GraphQL](http://graphql.org/)
* Node.js Express, MongoDB (api)
* ElasticSearch (search)
* Python (scripts)
* Docker
* Git, Git-flow

```

          SPA (CycleJS, xstream)   •  •  •  •  •  •  •  •  •  •
          ______________________                              •
                    •                                         •
                    •                                         •
                    •                                        REST
                 GraphQL                                      •
                    •                                         •
                    •                                         •
                    •                                         •
          API (Node.js Express)    •  •  REST  •  •  >  ElasticSearch
          _____________________                         _____________
                    •
                    •
                    •
                 MongoDB
                 _______

```

## Changelog


## Repositories
* This: documentation
* [diary-api](https://github.com/mathieueveillard/diary-api)
* [diary-spa](https://github.com/mathieueveillard/diary-spa)


## Deployment
### mongo
### elastic search
### api
### spa
### scripts
### watchtower

## License
GNU GPLv3
