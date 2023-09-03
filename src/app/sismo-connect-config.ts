import {
  ClaimType,
  AuthType,
  SignatureRequest,
  AuthRequest,
  ClaimRequest,
  SismoConnectConfig,
} from "@sismo-core/sismo-connect-client";

export { ClaimType, AuthType };
export const CONFIG: SismoConnectConfig = {
  appId: "0xdfe9611300c31711045d9249f656dc76",
  
};

// Request users to prove ownership of a Data Source (Wallet, Twitter, Github, Telegram, etc.)
export const AUTHS: AuthRequest[] = [
  // Anonymous identifier of the vault for this app
  // vaultId = hash(vaultSecret, appId).
  // full docs: https://docs.sismo.io/sismo-docs/build-with-sismo-connect/technical-documentation/vault-and-proof-identifiers
  { authType: AuthType.VAULT },
  { authType: AuthType.EVM_ACCOUNT },
  // { authType: AuthType.GITHUB, isOptional: true },
  { authType: AuthType.TWITTER, isOptional: true },
  // { authType: AuthType.TELEGRAM, userId: "875608110", isOptional: true },
];

// Request users to prove membership in a Data Group (e.g I own a wallet that is part of a DAO, owns an NFT, etc.)
export const CLAIMS: ClaimRequest[] = [
  {
    // claim Gitcoin Passport Holders Data Group membership: https://factory.sismo.io/groups-explorer?search=0x1cde61966decb8600dfd0749bd371f12
    // Data Group members          = Gitcoin Passport Holders
    // value for each group member = Gitcoin Passport Score
    // request user to prove membership in the group with value > 15, user can reveal more if they want
    groupId: "0xb543af195f2242ab8ce2f829ffa0e9b8",
    claimType: ClaimType.GTE,
    value: 10, // dhadrien.sismo.eth has a score of 46, eligible. Can reveal more.
    isSelectableByUser: true, // can reveal more than 15 if they want
  }
];

// Request users to sign a message
export const SIGNATURE_REQUEST: SignatureRequest = {
  message: "계정을 생성하는 것에 동의하겠습니다.",
  isSelectableByUser: false,
};
