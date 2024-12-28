/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lending2.json`.
 */
export type Lending2 = {
    "address": "AjnXUaDfPD88JyARjMkYaCDnpbWuGiRZvHdvKfQbGZnt",
    "metadata": {
      "name": "lending2",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "borrow",
        "discriminator": [
          228,
          253,
          131,
          202,
          207,
          116,
          89,
          18
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "mintBorrow"
          },
          {
            "name": "userAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                }
              ]
            }
          },
          {
            "name": "bankBorrow",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "mintBorrow"
                }
              ]
            }
          },
          {
            "name": "bankTokenAccountBorrow",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "mintBorrow"
                }
              ]
            }
          },
          {
            "name": "userTokenAccountBorrow",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    116,
                    111,
                    107,
                    101,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                },
                {
                  "kind": "account",
                  "path": "mintBorrow"
                }
              ]
            }
          },
          {
            "name": "userAssociatedTokenAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "signer"
                },
                {
                  "kind": "account",
                  "path": "tokenProgram"
                },
                {
                  "kind": "account",
                  "path": "mintBorrow"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "priceUpdate"
          },
          {
            "name": "tokenProgram"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "deposit",
        "discriminator": [
          242,
          35,
          198,
          137,
          82,
          225,
          242,
          182
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "mint"
          },
          {
            "name": "userAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                }
              ]
            }
          },
          {
            "name": "bank",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "bankTokenAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "userTokenAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    116,
                    111,
                    107,
                    101,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "userTokenAssociatedAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "signer"
                },
                {
                  "kind": "account",
                  "path": "tokenProgram"
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "priceUpdate"
          },
          {
            "name": "tokenProgram"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "initBank",
        "discriminator": [
          73,
          111,
          27,
          243,
          202,
          129,
          159,
          80
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "mint"
          },
          {
            "name": "bank",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "bankTokenAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "tokenProgram"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "liquidationThreshold",
            "type": "u64"
          },
          {
            "name": "maxLtv",
            "type": "u64"
          },
          {
            "name": "priceFeedId",
            "type": "string"
          }
        ]
      },
      {
        "name": "initUserTokenAccount",
        "discriminator": [
          178,
          230,
          125,
          63,
          43,
          166,
          195,
          232
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "mint"
          },
          {
            "name": "userTokenAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    116,
                    111,
                    107,
                    101,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "mintAddress",
            "type": "pubkey"
          }
        ]
      },
      {
        "name": "repay",
        "discriminator": [
          234,
          103,
          67,
          82,
          208,
          234,
          219,
          166
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "mint"
          },
          {
            "name": "bank",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "bankTokenAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "userAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                }
              ]
            }
          },
          {
            "name": "userTokenAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    116,
                    111,
                    107,
                    101,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "userAssociatedTokenAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "signer"
                },
                {
                  "kind": "account",
                  "path": "tokenProgram"
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "priceUpdate"
          },
          {
            "name": "tokenProgram"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdraw",
        "discriminator": [
          183,
          18,
          70,
          156,
          148,
          109,
          161,
          34
        ],
        "accounts": [
          {
            "name": "signer",
            "writable": true,
            "signer": true
          },
          {
            "name": "mint"
          },
          {
            "name": "userAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                }
              ]
            }
          },
          {
            "name": "userTokenAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    117,
                    115,
                    101,
                    114,
                    45,
                    116,
                    111,
                    107,
                    101,
                    110
                  ]
                },
                {
                  "kind": "account",
                  "path": "signer"
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "bank",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "bankTokenAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ]
            }
          },
          {
            "name": "userAssociatedTokenAccount",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "account",
                  "path": "signer"
                },
                {
                  "kind": "account",
                  "path": "tokenProgram"
                },
                {
                  "kind": "account",
                  "path": "mint"
                }
              ],
              "program": {
                "kind": "const",
                "value": [
                  140,
                  151,
                  37,
                  143,
                  78,
                  36,
                  137,
                  241,
                  187,
                  61,
                  16,
                  41,
                  20,
                  142,
                  13,
                  131,
                  11,
                  90,
                  19,
                  153,
                  218,
                  255,
                  16,
                  132,
                  4,
                  142,
                  123,
                  216,
                  219,
                  233,
                  248,
                  89
                ]
              }
            }
          },
          {
            "name": "priceUpdate"
          },
          {
            "name": "tokenProgram"
          },
          {
            "name": "associatedTokenProgram",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "bank",
        "discriminator": [
          142,
          49,
          166,
          242,
          50,
          66,
          97,
          188
        ]
      },
      {
        "name": "priceUpdateV2",
        "discriminator": [
          34,
          241,
          35,
          99,
          157,
          126,
          244,
          205
        ]
      },
      {
        "name": "user",
        "discriminator": [
          159,
          117,
          95,
          227,
          239,
          151,
          58,
          236
        ]
      },
      {
        "name": "userTokenAccount",
        "discriminator": [
          54,
          43,
          28,
          109,
          148,
          154,
          11,
          34
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "insufficientFunds",
        "msg": "The user does not have enough funds to withdraw"
      },
      {
        "code": 6001,
        "name": "overBorrowableAmount",
        "msg": "Requested amount exceeds borrowable amount"
      },
      {
        "code": 6002,
        "name": "overRepay",
        "msg": "Over Repay!"
      },
      {
        "code": 6003,
        "name": "notUnderCollateralized",
        "msg": "User is not under collateralized! can't be liquidated"
      },
      {
        "code": 6004,
        "name": "mathOverflow",
        "msg": "Math Over Flow"
      },
      {
        "code": 6005,
        "name": "insufficientBorrow",
        "msg": "Insufficient Amount "
      },
      {
        "code": 6006,
        "name": "exceedsMaxLtv",
        "msg": "Exceeds MAX LTV"
      },
      {
        "code": 6007,
        "name": "insufficientCollateral",
        "msg": "Insufficient Collateral"
      },
      {
        "code": 6008,
        "name": "invalidDecimals",
        "msg": "Invalid Decimals"
      }
    ],
    "types": [
      {
        "name": "bank",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "pubkey"
            },
            {
              "name": "mintAddress",
              "type": "pubkey"
            },
            {
              "name": "totalDeposits",
              "type": "u64"
            },
            {
              "name": "totalDepositsShares",
              "type": "u64"
            },
            {
              "name": "totalBorrowed",
              "type": "u64"
            },
            {
              "name": "totalBorrowedShares",
              "type": "u64"
            },
            {
              "name": "liquidationThreshold",
              "type": "u64"
            },
            {
              "name": "liquidationBonus",
              "type": "u64"
            },
            {
              "name": "liquidationCloseFactor",
              "type": "u64"
            },
            {
              "name": "maxLtv",
              "type": "u64"
            },
            {
              "name": "lastUpdated",
              "type": "i64"
            },
            {
              "name": "interestRate",
              "type": "u64"
            },
            {
              "name": "priceFeedId",
              "type": "string"
            }
          ]
        }
      },
      {
        "name": "priceFeedMessage",
        "repr": {
          "kind": "c"
        },
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "feedId",
              "docs": [
                "`FeedId` but avoid the type alias because of compatibility issues with Anchor's `idl-build` feature."
              ],
              "type": {
                "array": [
                  "u8",
                  32
                ]
              }
            },
            {
              "name": "price",
              "type": "i64"
            },
            {
              "name": "conf",
              "type": "u64"
            },
            {
              "name": "exponent",
              "type": "i32"
            },
            {
              "name": "publishTime",
              "docs": [
                "The timestamp of this price update in seconds"
              ],
              "type": "i64"
            },
            {
              "name": "prevPublishTime",
              "docs": [
                "The timestamp of the previous price update. This field is intended to allow users to",
                "identify the single unique price update for any moment in time:",
                "for any time t, the unique update is the one such that prev_publish_time < t <= publish_time.",
                "",
                "Note that there may not be such an update while we are migrating to the new message-sending logic,",
                "as some price updates on pythnet may not be sent to other chains (because the message-sending",
                "logic may not have triggered). We can solve this problem by making the message-sending mandatory",
                "(which we can do once publishers have migrated over).",
                "",
                "Additionally, this field may be equal to publish_time if the message is sent on a slot where",
                "where the aggregation was unsuccesful. This problem will go away once all publishers have",
                "migrated over to a recent version of pyth-agent."
              ],
              "type": "i64"
            },
            {
              "name": "emaPrice",
              "type": "i64"
            },
            {
              "name": "emaConf",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "priceUpdateV2",
        "docs": [
          "A price update account. This account is used by the Pyth Receiver program to store a verified price update from a Pyth price feed.",
          "It contains:",
          "- `write_authority`: The write authority for this account. This authority can close this account to reclaim rent or update the account to contain a different price update.",
          "- `verification_level`: The [`VerificationLevel`] of this price update. This represents how many Wormhole guardian signatures have been verified for this price update.",
          "- `price_message`: The actual price update.",
          "- `posted_slot`: The slot at which this price update was posted."
        ],
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "writeAuthority",
              "type": "pubkey"
            },
            {
              "name": "verificationLevel",
              "type": {
                "defined": {
                  "name": "verificationLevel"
                }
              }
            },
            {
              "name": "priceMessage",
              "type": {
                "defined": {
                  "name": "priceFeedMessage"
                }
              }
            },
            {
              "name": "postedSlot",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "user",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "pubkey"
            },
            {
              "name": "totalDepositValue",
              "type": "u64"
            },
            {
              "name": "totalBorrowValue",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "userTokenAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "pubkey"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "mint",
              "type": "pubkey"
            },
            {
              "name": "depositAmount",
              "type": "u64"
            },
            {
              "name": "depositShares",
              "type": "u64"
            },
            {
              "name": "borrowedAmount",
              "type": "u64"
            },
            {
              "name": "borrowedShares",
              "type": "u64"
            },
            {
              "name": "lastUpdate",
              "type": "i64"
            },
            {
              "name": "lastUpdateBorrow",
              "type": "i64"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "verificationLevel",
        "docs": [
          "Pyth price updates are bridged to all blockchains via Wormhole.",
          "Using the price updates on another chain requires verifying the signatures of the Wormhole guardians.",
          "The usual process is to check the signatures for two thirds of the total number of guardians, but this can be cumbersome on Solana because of the transaction size limits,",
          "so we also allow for partial verification.",
          "",
          "This enum represents how much a price update has been verified:",
          "- If `Full`, we have verified the signatures for two thirds of the current guardians.",
          "- If `Partial`, only `num_signatures` guardian signatures have been checked.",
          "",
          "# Warning",
          "Using partially verified price updates is dangerous, as it lowers the threshold of guardians that need to collude to produce a malicious price update."
        ],
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "partial",
              "fields": [
                {
                  "name": "numSignatures",
                  "type": "u8"
                }
              ]
            },
            {
              "name": "full"
            }
          ]
        }
      }
    ],
    "constants": [
      {
        "name": "amountScale",
        "type": "u64",
        "value": "1000000000"
      },
      {
        "name": "interestRateScale",
        "type": "u64",
        "value": "10000"
      },
      {
        "name": "liquidationThresholdRateScale",
        "type": "u64",
        "value": "10000"
      },
      {
        "name": "maxAge",
        "type": "u64",
        "value": "100"
      },
      {
        "name": "maxLtvRateScale",
        "type": "u64",
        "value": "10000"
      }
    ]
  };
  