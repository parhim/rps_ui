type Mutable<T> = {
  -readonly [K in keyof T]: Mutable<T[K]>;
};

// NOTE: when updating the IDL, account names must be adjusted to camelCase for proper typing.

const _IDL = {
  address: "HLxxaaUG6x7hXKxdw9p9JCiCSgqArf5EJyTbrWN9S41n",
  metadata: {
    name: "rock_paper_scissors",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "collect",
      discriminator: [208, 47, 194, 155, 17, 98, 82, 236],
      accounts: [
        {
          name: "game",
          writable: true,
        },
        {
          name: "player",
          writable: true,
          signer: true,
        },
        {
          name: "vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "game",
              },
              {
                kind: "const",
                value: [118, 97, 117, 108, 116],
              },
            ],
          },
        },
      ],
      args: [],
    },
    {
      name: "commit_choice",
      discriminator: [73, 157, 49, 7, 250, 212, 125, 182],
      accounts: [
        {
          name: "game",
          writable: true,
        },
        {
          name: "player",
          writable: true,
          signer: true,
        },
        {
          name: "vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "game",
              },
              {
                kind: "const",
                value: [118, 97, 117, 108, 116],
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "commitment",
          type: {
            array: ["u8", 32],
          },
        },
      ],
    },
    {
      name: "create_game",
      discriminator: [124, 69, 75, 66, 184, 220, 72, 206],
      accounts: [
        {
          name: "game",
          writable: true,
          signer: true,
        },
        {
          name: "host",
          writable: true,
          signer: true,
        },
        {
          name: "vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "game",
              },
              {
                kind: "const",
                value: [118, 97, 117, 108, 116],
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "bet_size",
          type: "u64",
        },
      ],
    },
    {
      name: "end_game",
      discriminator: [224, 135, 245, 99, 67, 175, 121, 252],
      accounts: [
        {
          name: "game",
          writable: true,
        },
        {
          name: "host",
          writable: true,
          signer: true,
        },
        {
          name: "vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "game",
              },
              {
                kind: "const",
                value: [118, 97, 117, 108, 116],
              },
            ],
          },
        },
      ],
      args: [],
    },
    {
      name: "join_game",
      discriminator: [107, 112, 18, 38, 56, 173, 60, 128],
      accounts: [
        {
          name: "game",
          writable: true,
        },
        {
          name: "challenger",
          signer: true,
        },
      ],
      args: [],
    },
    {
      name: "reveal_choice",
      discriminator: [235, 189, 39, 0, 144, 153, 52, 9],
      accounts: [
        {
          name: "game",
          writable: true,
        },
        {
          name: "player",
          signer: true,
        },
      ],
      args: [
        {
          name: "choice",
          type: "u8",
        },
        {
          name: "nonce",
          type: {
            array: ["u8", 32],
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: "Game",
      discriminator: [27, 90, 166, 125, 74, 100, 121, 18],
    },
    {
      name: "Vault",
      discriminator: [211, 8, 232, 43, 2, 152, 117, 119],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidPlayer",
      msg: "Invalid player.",
    },
    {
      code: 6001,
      name: "InvalidCommitment",
      msg: "Invalid commitment.",
    },
    {
      code: 6002,
      name: "ChallengerAlreadySet",
      msg: "Challenger already set.",
    },
    {
      code: 6003,
      name: "NotAPlayer",
      msg: "Not a player.",
    },
    {
      code: 6004,
      name: "GameNotCompleted",
      msg: "Game not completed.",
    },
    {
      code: 6005,
      name: "InvalidGameState",
      msg: "Invalid game state",
    },
    {
      code: 6006,
      name: "GameNotClosable",
      msg: "Unable to close",
    },
  ],
  types: [
    {
      name: "Game",
      type: {
        kind: "struct",
        fields: [
          {
            name: "host",
            type: "pubkey",
          },
          {
            name: "challenger",
            type: {
              option: "pubkey",
            },
          },
          {
            name: "host_commitment",
            type: {
              option: {
                array: ["u8", 32],
              },
            },
          },
          {
            name: "challenger_commitment",
            type: {
              option: {
                array: ["u8", 32],
              },
            },
          },
          {
            name: "host_choice",
            type: {
              option: "u8",
            },
          },
          {
            name: "challenger_choice",
            type: {
              option: "u8",
            },
          },
          {
            name: "bet_size",
            type: "u64",
          },
          {
            name: "game_state",
            type: {
              defined: {
                name: "GameState",
              },
            },
          },
          {
            name: "commitment_deadline",
            type: {
              option: "u64",
            },
          },
        ],
      },
    },
    {
      name: "GameState",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Waiting",
          },
          {
            name: "Active",
          },
          {
            name: "Ready",
          },
          {
            name: "Completed",
          },
        ],
      },
    },
    {
      name: "Vault",
      type: {
        kind: "struct",
        fields: [
          {
            name: "lamports",
            type: "u64",
          },
        ],
      },
    },
  ],
} as const;

export const RPS_IDL = _IDL as Mutable<typeof _IDL>;
