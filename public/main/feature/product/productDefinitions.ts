import { ProductModels } from "./productModels";
import { FensterProductOptionTypes } from "./productOptionTypes";
import { FensterTags } from "./tags";

const productDefinitions =
{
    0:
    {
        "productModel": ProductModels.FENSTER,
        "productOptionDefinitions":
        {
            0:
            {
                "type": FensterProductOptionTypes.MATERIAL,
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": [FensterTags.KUNSTSTOFF],
                        "requirements": {}
                    },
                    1:
                    {
                        "tags": [FensterTags.HOLZ],
                        "requirements": {}
                    },
                }
            },
            1:
            {
                "type": FensterProductOptionTypes.PROFIL,
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": [FensterTags.KUNSTSTOFF, FensterTags.KOEMMERLING],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.MATERIAL,
                                "tags": [FensterTags.KUNSTSTOFF]
                            }
                        }
                    },

                    1:
                    {
                        "tags": [FensterTags.KUNSTSTOFF, FensterTags.ARCADE],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.MATERIAL,
                                "tags": [FensterTags.KUNSTSTOFF]
                            }
                        }
                    }
                }
            },
            2:
            {
                "type": FensterProductOptionTypes.FARBE,
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": [FensterTags.KUNSTSTOFF, FensterTags.KOEMMERLING],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.PROFIL,
                                "tags": [FensterTags.KUNSTSTOFF, FensterTags.KOEMMERLING]
                            }
                        }
                    },
                    1:
                    {
                        "tags": [FensterTags.KUNSTSTOFF, FensterTags.ARCADE],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.PROFIL,
                                "tags": [FensterTags.KUNSTSTOFF, FensterTags.ARCADE]
                            }
                        }
                    }
                }
            },
            3:
            {
                "type": FensterProductOptionTypes.FENSTERTYP,
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": [FensterTags.EINTEILIG],
                        "requirements": {}
                    },
                    1:
                    {
                        "tags": [FensterTags.ZWEITEILIG],
                        "requirements": {}
                    },
                    2:
                    {
                        "tags": [FensterTags.DREITEILIG],
                        "requirements": {}
                    }
                }
            },
            4:
            {
                "type": FensterProductOptionTypes.FENSTERLICHT,
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": [FensterTags.EINTEILIG, FensterTags.OHNELICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.EINTEILIG]
                            }
                        }
                    },
                    1:
                    {
                        "tags": [FensterTags.EINTEILIG, FensterTags.UNTERLICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.EINTEILIG]
                            }
                        }
                    },
                    2:
                    {
                        "tags": [FensterTags.EINTEILIG, FensterTags.OBERLICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.EINTEILIG]
                            }
                        }
                    },
                    3:
                    {
                        "tags": [FensterTags.ZWEITEILIG, FensterTags.OHNELICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.ZWEITEILIG]
                            }
                        }
                    },
                    4:
                    {
                        "tags": [FensterTags.ZWEITEILIG, FensterTags.UNTERLICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.ZWEITEILIG]
                            }
                        }
                    },
                    5:
                    {
                        "tags": [FensterTags.ZWEITEILIG, FensterTags.OBERLICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.ZWEITEILIG]
                            }
                        }
                    },
                    6:
                    {
                        "tags": [FensterTags.DREITEILIG, FensterTags.OHNELICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.DREITEILIG]
                            }
                        }
                    },
                    7:
                    {
                        "tags": [FensterTags.DREITEILIG, FensterTags.UNTERLICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.DREITEILIG]
                            }
                        }
                    },
                    8:
                    {
                        "tags": [FensterTags.DREITEILIG, FensterTags.OBERLICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.DREITEILIG]
                            }
                        }
                    }
                }
            },
            5:
            {
                "type": FensterProductOptionTypes.OEFFNUNGSART,
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": [FensterTags.EINTEILIG, FensterTags.OHNELICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.EINTEILIG]
                            },
                            1:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERLICHT,
                                "tags": [FensterTags.OHNELICHT]
                            }
                        }
                    },
                    1:
                    {
                        "tags": [FensterTags.EINTEILIG, FensterTags.OBERLICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.EINTEILIG]
                            },
                            1:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERLICHT,
                                "tags": [FensterTags.OBERLICHT]
                            }
                        }
                    },
                    2:
                    {
                        "tags": [FensterTags.EINTEILIG, FensterTags.UNTERLICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.EINTEILIG]
                            },
                            1:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERLICHT,
                                "tags": [FensterTags.UNTERLICHT]
                            }
                        }
                    },
                    3:
                    {
                        "tags": [FensterTags.EINTEILIG, FensterTags.OHNELICHT],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERTYP,
                                "tags": [FensterTags.EINTEILIG]
                            },
                            1:
                            {
                                "productOptionType": FensterProductOptionTypes.FENSTERLICHT,
                                "tags": [FensterTags.OHNELICHT]
                            }
                        }
                    },
                }
            }
        }
    }
}

export default productDefinitions;