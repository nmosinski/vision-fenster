export const productDefinitionObject =
{
    0: 
    {
        "productModel": "fenster",
        "productOptionDefinitions": 
        {
            0: 
            {
                "type": "material",
                "required": true,
                "combinations": 
                {
                    0: 
                    {
                        "tags": ["kunststoff"],
                        "requirements": {}
                    },
                    1: 
                    {
                        "tags": ["holz"],
                        "requirements": {}
                    }, 
                }
            },
            1: 
            {
                "type": "profil",
                "required": true,
                "combinations": 
                {
                    0: 
                    {
                        "tags": ["kunststoff", "kömmerling"],
                        "requirements": 
                        {
                            0:
                            {
                                "productOptionType":"material",
                                "tags": ["kunststoff"]
                            }
                        }
                    },

                    1:
                    {
                        "tags": ["kunststoff", "arcade"],
                        "requirements": 
                        {
                            0:
                            {
                                "productOptionType": "material",
                                "tags": ["kunststoff"]
                            }
                        }
                    }
                }
            },
            2:
            {
                "type": "farbe",
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": ["kunststoff, kömmerling"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "profil",
                                "tags": ["kunststoff, kömmerling"]
                            }
                        }
                    },
                    1:
                    {
                        "tags": ["kunststoff, arcade"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "profil",
                                "tags": ["kunststoff, arcade"]
                            }
                        }
                    }
                }
            },
            3:
            {
                "type": "fenstertyp",
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": ["einteilig"],
                        "requirements": {}
                    },
                    1:
                    {
                        "tags": ["zweiteilig"],
                        "requirements": {}
                    },
                    2:
                    {
                        "tags": ["dreiteilig"],
                        "requirements": {}
                    }
                }
            },
            4:
            {
                "type": "fensterlicht",
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": ["einteilig", "ohnelicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            }
                        }
                    },
                    1:
                    {
                        "tags": ["einteilig", "unterlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            }
                        }
                    },
                    2:
                    {
                        "tags": ["einteilig", "oberlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            }
                        }
                    },
                    3:
                    {
                        "tags": ["zweiteilig", "ohnelicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["zweiteilig"]
                            }
                        }
                    },
                    4:
                    {
                        "tags": ["zweiteilig", "unterlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["zweiteilig"]
                            }
                        }
                    },
                    5:
                    {
                        "tags": ["zweiteilig", "oberlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["zweiteilig"]
                            }
                        }
                    },
                    6:
                    {
                        "tags": ["dreiteilig", "ohnelicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["dreiteilig"]
                            }
                        }
                    },
                    7:
                    {
                        "tags": ["dreiteilig", "unterlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["dreiteilig"]
                            }
                        }
                    },
                    8:
                    {
                        "tags": ["dreiteilig", "oberlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["dreiteilig"]
                            }
                        }
                    }
                }
            },
            5:
            {
                "type": "öffnungsart",
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": ["einteilig", "ohnelicht", "fest"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            },
                            1:
                            {
                                "productOptionType": "fensterlicht",
                                "tags": ["ohnelicht"]
                            }
                        }
                    },
                    1:
                    {
                        "tags": ["einteilig", "ohnelicht", "dreh"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            },
                            1:
                            {
                                "productOptionType": "fensterlicht",
                                "tags": ["ohnelicht"]
                            }
                        }
                    },
                    2:
                    {
                        "tags": ["einteilig", "ohnelicht", "kipp"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            },
                            1:
                            {
                                "productOptionType": "fensterlicht",
                                "tags": ["ohnelicht"]
                            }
                        }
                    },
                    3:
                    {
                        "tags": ["einteilig", "ohnelicht", "kipp", "dreh"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            },
                            1:
                            {
                                "productOptionType": "fensterlicht",
                                "tags": ["ohnelicht"]
                            }
                        }
                    }
                }
            }
        }
    }
}