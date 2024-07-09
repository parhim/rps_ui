/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/rock_paper_scissors.json`.
 */
export type RockPaperScissors = {
  address: "36tKoNCFHpYzBjwjUqQ3gFL8aJ5tZfH6PF6gyGSNMJMn";
  metadata: {
    name: "rockPaperScissors";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "collect";
      discriminator: [208, 47, 194, 155, 17, 98, 82, 236];
      accounts: [
        {
          name: "game";
          writable: true;
        },
        {
          name: "player";
          writable: true;
          signer: true;
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "game";
              },
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              }
            ];
          };
        }
      ];
      args: [];
    },
    {
      name: "commitChoice";
      discriminator: [73, 157, 49, 7, 250, 212, 125, 182];
      accounts: [
        {
          name: "game";
          writable: true;
        },
        {
          name: "player";
          writable: true;
          signer: true;
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "game";
              },
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "commitment";
          type: {
            array: ["u8", 32];
          };
        }
      ];
    },
    {
      name: "createGame";
      discriminator: [124, 69, 75, 66, 184, 220, 72, 206];
      accounts: [
        {
          name: "game";
          writable: true;
          signer: true;
        },
        {
          name: "host";
          writable: true;
          signer: true;
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "game";
              },
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "betSize";
          type: "u64";
        }
      ];
    },
    {
      name: "endGame";
      discriminator: [224, 135, 245, 99, 67, 175, 121, 252];
      accounts: [
        {
          name: "game";
          writable: true;
        },
        {
          name: "host";
          writable: true;
          signer: true;
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "game";
              },
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              }
            ];
          };
        }
      ];
      args: [];
    },
    {
      name: "joinGame";
      discriminator: [107, 112, 18, 38, 56, 173, 60, 128];
      accounts: [
        {
          name: "game";
          writable: true;
        },
        {
          name: "challenger";
          signer: true;
        }
      ];
      args: [];
    },
    {
      name: "revealChoice";
      discriminator: [235, 189, 39, 0, 144, 153, 52, 9];
      accounts: [
        {
          name: "game";
          writable: true;
        },
        {
          name: "player";
          signer: true;
        }
      ];
      args: [
        {
          name: "choice";
          type: "u8";
        },
        {
          name: "nonce";
          type: {
            array: ["u8", 32];
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "game";
      discriminator: [27, 90, 166, 125, 74, 100, 121, 18];
    },
    {
      name: "vault";
      discriminator: [211, 8, 232, 43, 2, 152, 117, 119];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidPlayer";
      msg: "Invalid player.";
    },
    {
      code: 6001;
      name: "invalidCommitment";
      msg: "Invalid commitment.";
    },
    {
      code: 6002;
      name: "challengerAlreadySet";
      msg: "Challenger already set.";
    },
    {
      code: 6003;
      name: "notAPlayer";
      msg: "Not a player.";
    },
    {
      code: 6004;
      name: "gameNotCompleted";
      msg: "Game not completed.";
    },
    {
      code: 6005;
      name: "invalidGameState";
      msg: "Invalid game state";
    },
    {
      code: 6006;
      name: "gameNotClosable";
      msg: "Unable to close";
    }
  ];
  types: [
    {
      name: "game";
      type: {
        kind: "struct";
        fields: [
          {
            name: "host";
            type: "pubkey";
          },
          {
            name: "challenger";
            type: {
              option: "pubkey";
            };
          },
          {
            name: "hostCommitment";
            type: {
              option: {
                array: ["u8", 32];
              };
            };
          },
          {
            name: "challengerCommitment";
            type: {
              option: {
                array: ["u8", 32];
              };
            };
          },
          {
            name: "hostChoice";
            type: {
              option: "u8";
            };
          },
          {
            name: "challengerChoice";
            type: {
              option: "u8";
            };
          },
          {
            name: "betSize";
            type: "u64";
          },
          {
            name: "gameState";
            type: {
              defined: {
                name: "gameState";
              };
            };
          }
        ];
      };
    },
    {
      name: "gameState";
      type: {
        kind: "enum";
        variants: [
          {
            name: "waiting";
          },
          {
            name: "active";
          },
          {
            name: "ready";
          },
          {
            name: "completed";
          }
        ];
      };
    },
    {
      name: "vault";
      type: {
        kind: "struct";
        fields: [
          {
            name: "lamports";
            type: "u64";
          }
        ];
      };
    }
  ];
};
