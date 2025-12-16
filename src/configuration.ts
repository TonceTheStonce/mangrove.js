// --- SNIP: imports unchanged ---
import loadedTokens from "./constants/tokens.json";
import loadedBlockManagerOptionsByNetwork from "./constants/blockManagerOptionsByNetwork.json";
import loadedReliableHttpProviderOptionsByNetwork from "./constants/reliableHttpProviderOptionsByNetwork.json";
import loadedReliableWebSocketOptionsByNetwork from "./constants/reliableWebSocketOptionsByNetwork.json";
import loadedKandelConfiguration from "./constants/kandelConfiguration.json";
import loadedMangroveOrderConfiguration from "./constants/mangroveOrder.json";
import contractVersionRanges from "./constants/contractVersionRanges.json";

import { ethers } from "ethers";
import Big from "big.js";
import {
  BlockManager,
  ReliableHttpProvider,
  ReliableWebsocketProvider,
} from "@mangrovedao/reliable-event-subscriber";
import { Provider, typechain } from "./types";
import { Bigish } from "./util";
import * as mgvDeployments from "@mangrovedao/mangrove-deployments";
import * as contextAddresses from "@mangrovedao/context-addresses";
import * as eth from "./eth";
import clone from "just-clone";
import deepmerge from "deepmerge";
import type { Prettify } from "./util/types";
import type Mangrove from "./mangrove";

// =======================
// OXIUM / SEI PATCH
// =======================
const SEI_NETWORK_NAME = "sei";
const OXIUM_MANGROVE_ADDRESS =
  "0x32360BB61fcb9cDCDD44eD44328b848061c0b9D7";
const OXIUM_MGV_READER_ADDRESS =
  "0xB5C0a4249ee477860D47aD688386F2427F0F072a";

// --- rest of types unchanged ---

let config: Configuration;

// --- SNIP: everything unchanged until resetConfiguration() ---

export function resetConfiguration(): void {
  config = {
    addressesByNetwork: {},
    tokenDefaults: {
      defaultDisplayedDecimals: 2,
      defaultDisplayedPriceDecimals: 6,
    },
    tokens: clone(loadedTokens as Record<tokenId, TokenConfig>),
    tokenSymbolDefaultIdsByNetwork: {},
    reliableEventSubscriber: {
      defaultBlockManagerOptions: {
        maxBlockCached: 50,
        maxRetryGetBlock: 10,
        retryDelayGetBlockMs: 500,
        maxRetryGetLogs: 10,
        retryDelayGetLogsMs: 500,
        batchSize: 200,
      },
      blockManagerOptionsByNetwork: clone(
        loadedBlockManagerOptionsByNetwork as Record<
          network,
          BlockManager.Options
        >,
      ),
      defaultReliableHttpProviderOptions: {
        estimatedBlockTimeMs: 2000,
      },
      reliableHttpProviderOptionsByNetwork: clone(
        loadedReliableHttpProviderOptionsByNetwork as Record<
          network,
          Omit<ReliableHttpProvider.Options, "onError">
        >,
      ),
      defaultReliableWebSocketOptions: {
        pingIntervalMs: 10000,
        pingTimeoutMs: 5000,
        estimatedBlockTimeMs: 2000,
      },
      reliableWebSocketOptionsByNetwork: clone(
        loadedReliableWebSocketOptionsByNetwork as Record<
          network,
          Omit<ReliableWebsocketProvider.Options, "wsUrl">
        >,
      ),
    },
    mangroveOrder: clone(
      loadedMangroveOrderConfiguration as PartialMangroveOrderConfiguration,
    ),
    kandel: clone(loadedKandelConfiguration as PartialKandelConfiguration),
  };

  // Load upstream addresses
  readContextAddressesAndTokens();
  readMangroveDeploymentAddresses();

  // =======================
  // OXIUM SEI OVERRIDES
  // =======================
  addressesConfiguration.setAddress(
    "Mangrove",
    OXIUM_MANGROVE_ADDRESS,
    SEI_NETWORK_NAME,
  );

  addressesConfiguration.setAddress(
    "MgvReader",
    OXIUM_MGV_READER_ADDRESS,
    SEI_NETWORK_NAME,
  );
}

// --- SNIP: everything else unchanged ---

resetConfiguration();

export const configuration = {
  addresses: addressesConfiguration,
  tokens: tokensConfiguration,
  reliableEventSubscriber: reliableEventSubscriberConfiguration,
  kandel: kandelConfiguration,
  mangroveOrder: mangroveOrderConfiguration,
  resetConfiguration,
  updateConfiguration,
};

export default configuration;
