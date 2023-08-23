import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_URL = "https://dydx-mev-api-dev.skip.money";
// const API_URL = "https://dydx-mev-api-prod.skip.money";

export interface Validator {
  moniker: string;
  pubkey: string;
  stake: string;
}

export interface GetValidatorsResponse {
  validators: Validator[];
}

export async function getValidators(): Promise<Validator[]> {
  const response = await axios.get(`${API_URL}/v1/validator`);

  const { validators } = response.data as GetValidatorsResponse;

  return validators;

  // return [
  //   {
  //     pubkey: "946377483C9A6D2F42D3B787AAA59217AE011484",
  //     moniker: "Staked",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "0CB1E12E944593608B07F833D61C72EA96E91E71",
  //     moniker: "P2P.ORG - P2P Validator",
  //     stake: "55000000000",
  //   },
  //   {
  //     pubkey: "3F667030DDD9C561EC66F35E8221BE0178CF62C4",
  //     moniker: "dydx-1",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "88A3677A7146758B9D4A9D9B7F902EFB05B9BD86",
  //     moniker: "Crosnest",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "7FFBBCD4B3CEA1D74DE46C7353993DB78C46FA27",
  //     moniker: "Chorus One",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "ED4A9B9AE4F6E7AAB14A7B28E4049DE384DC5487",
  //     moniker: "dydx-research",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "D9A02720E2244366FAB01C08B8A9526E7195EE20",
  //     moniker: "Finoa Consensus Services",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "AF98AD25D2FBDB2CA171C67AC2EEA8B1DE61706D",
  //     moniker: "StakeRun",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "291D0974D8F8E69E274C6108C130A4348E0C2A46",
  //     moniker: "BwareLabs",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "FF3D278D8A08FF9B752422372BBA7A0002F7C054",
  //     moniker: "Nodeinfra",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "4C91F8A80566902E7A7CBD446C0B4B8793BEE584",
  //     moniker: "Notional",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "50720CF2F3A1A0A44427A23ECD5F5823409876E6",
  //     moniker: "node101",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "E2B6AD768B15ACAFCE97E567B7FC4DBF405997C5",
  //     moniker: "danku_zone w/ DAIC",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "178F9CF801377AE26FBFB8A07EBE4E4F333162FC",
  //     moniker: "Klub Staking",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "63C9293BBE6E1E4D1371B58648D292EAF6BA07F9",
  //     moniker: "Multiplex",
  //     stake: "1",
  //   },
  //   {
  //     pubkey: "5B616A06917B9DA6286AE586472286140D3B9521",
  //     moniker: "Dora Factory PGS",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "D04E2D6FDB25176E500E1CD2C3405DD086F2BDE1",
  //     moniker: "LydiaLabs",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "092142AE56451A80C98BF12C891C1D5A62609815",
  //     moniker: "Everstake",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "15760DC47655785EF4414D7FB7F39ECBCB96691D",
  //     moniker: "Nodes.Guru",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "E18CF04B3A4DD6A11D896353F73657F42D5103B5",
  //     moniker: "Luganodes",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "01458B61F0D7DE6E90798FE8C370413D718EB34C",
  //     moniker: "Cosmostation",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "48118EFCCE572659EDE5981EF2F9D1803039C36A",
  //     moniker: "Liquify",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "85D26FD34A580F2644BE4DE264B753859D0E6E40",
  //     moniker: "01node",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "A661C650A801F97B68DB770DA392534685C59A99",
  //     moniker: "AUDIT.one",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "83619D29BADC36BE90EE08665F66AA08C250054E",
  //     moniker: "ECO Stake 🌱",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "AA54F3D7CD3AF8DDB2007ED3AF6C6A410B5DC77B",
  //     moniker: "Node Guardians",
  //     stake: "99990000000",
  //   },
  //   {
  //     pubkey: "DF586858E6EC470C85F7D95204D77E8F3135D39E",
  //     moniker: "Huginn",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "677C0DC5709B2F433D0108D9FC618A71BB6D6D69",
  //     moniker: " Lavender.Five Nodes 🐝",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "C1E8D6D9423F7D4F7835B8913E235D38394B6A94",
  //     moniker: "Multiplex",
  //     stake: "50001000999",
  //   },
  //   {
  //     pubkey: "21D3FDE4817155F81ED7E8F18E031D552B6C5EDB",
  //     moniker: "kingnodes 👑",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "2DB113966A99E7DCF432F0B1C6DDD46BC2F73FE0",
  //     moniker: "Validatrium.com",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "8E7C28BEFE0DCAEF0DFF5A79E1D285A5641C483D",
  //     moniker: "staker-space",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "643B085913CAB5A49A355039C62152C30CC57FCF",
  //     moniker: "RockX",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "57D60D24B37B3CDDE844F87ECAF528879A53DCB8",
  //     moniker: "Stir",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "0E0531AD07D262601AD4D87CB88A1A4537F4D7B0",
  //     moniker: "StakingCabin",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "BC855318584DFF0E9341358DF8784F928EBE642D",
  //     moniker: "A41",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "37F0ABE12F55402B9CEE77D56B69B507093928BC",
  //     moniker: "P-OPS Team",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "B8C3018BEF6412F4637FF193230FA8126167E255",
  //     moniker: "Provalidator",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "2B0F9E8201C5140B72AD6733A9AA17E3F994755C",
  //     moniker: "Swiss Staking",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "5C2D8C80B9DCC900B176223D2369084A22997B82",
  //     moniker: "Neuler",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "BF8928B053CF00F804E523F099F3B47F6F8DD89A",
  //     moniker: "Vault Staking",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "C86DEC746814D4E3086A1EC2964EA029E4042D03",
  //     moniker: "Informal Systems",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "A914CC04B56CC0D7F4FCBA07F8D600E05B538758",
  //     moniker: "mrgn-research",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "52314E1F47C4A1B61068C71525876E10A3EA631A",
  //     moniker: "Imperator.co",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "988D1079F09CB37A52BF4DE145FD3552D7542492",
  //     moniker: "GalaxyDigital",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "F7A64D7CE7B9C15B0DD75EB1BB761205E68AB4A7",
  //     moniker: "Stakecito",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "62FDD9C323C1DBB9486279638C9C6D4C64A0D253",
  //     moniker: "StakeLab",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "178B7ABE7B6FBDE8620588246EE7B63ED58FEAE1",
  //     moniker: "dydx-2",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "25E155571F07F7BE33AF604A76E8F84316300BD0",
  //     moniker: "DELIGHT",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "254BA268E712541F86D5BE7ABA0E99AEAF18BC93",
  //     moniker: "DSRV",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "228DE9090151D767E07F7A406BB7001DD66F9078",
  //     moniker: "Nodefleet.org",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "724A57A3A2095F7C66A6D1756196B46A2927AC1D",
  //     moniker: "Enigma",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "F077E42C23F9ED6A3F1FD6DCBB1D89D61254DC56",
  //     moniker: "Chill Validation",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "18C45EF1F0F7640FDFBFFF4014FC7C6115D979B8",
  //     moniker: "Golden Ratio Staking",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "54D20901B99F521F1DCE4F00656F762F32406178",
  //     moniker: "High Stakes 🇨🇭",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "15AA38CF5D75E92D9A2DA6695D408ED950C957F0",
  //     moniker: "DOUBLETOP",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "36252F40772537E928DA5A5A21A39A3EAA174037",
  //     moniker: "Keplr",
  //     stake: "50000300000",
  //   },
  //   {
  //     pubkey: "C3A208E3B6C8B2762C826E1B5569D8B1AE0C647D",
  //     moniker: "bc-dydx-validator-testnet-2.pacific.holdings",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "5A0A6F3C499A67EA38C05EDE8E6C78DC99459787",
  //     moniker: "Artifact",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "56AB9B2FCBDC697697179F1DF02548CEB822A89B",
  //     moniker: "✅ CryptoCrew Validators #IBCgang",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "FC1C44F895AC0C04D4E8C94AF769D52BBA3861CB",
  //     moniker: "figment",
  //     stake: "50000000000",
  //   },
  //   {
  //     pubkey: "38EDA3F9360D6A9341CE51B910EF8E790D86C206",
  //     moniker: "Google-Cloud-Web3",
  //     stake: "50000000000",
  //   },
  // ];
}

export async function getLatestHeight() {
  const response = await axios.get(`${API_URL}/v1/raw_mev?limit=1`);

  return parseInt(response.data.datapoints[0].height);
}

export interface ValidatorStats {
  averageMev: string;
  averageNormalizedMev: number;
  validatorPubkey: string;
}

export async function getValidatorStats(
  pubkey: string,
  fromHeight: number,
  toHeight: number
) {
  const response = await axios.get(
    `${API_URL}/v1/validator_stats?validator_pubkey=${pubkey}&from_height=${fromHeight}&to_height=${toHeight}`
  );

  return response.data.validatorStats as ValidatorStats;
}

interface Datapoint {
  value: number;
  proposer: string;
  height: string;
  probability: number;
}

interface DatapointRequest {
  proposers: string[];
  from?: number;
  to?: number;
  limit?: number;
}

export async function getNormalizedMEV(params: DatapointRequest) {
  const query = new URLSearchParams();

  for (const proposer of params.proposers) {
    query.append("proposers", proposer);
  }

  if (params.from) {
    query.append("from_height", params.from.toString());
  }

  if (params.to) {
    query.append("to_height", params.to.toString());
  }

  if (params.limit) {
    query.append("limit", params.limit.toString());
  }

  const response = await axios.get(
    `${API_URL}/v1/normalized_mev?${query.toString()}`
  );

  return response.data.datapoints as Datapoint[];
}

export async function getRawMEV(params: DatapointRequest) {
  const query = new URLSearchParams();

  for (const proposer of params.proposers) {
    query.append("proposers", proposer);
  }
  if (params.from) {
    query.append("from_height", params.from.toString());
  }

  if (params.to) {
    query.append("to_height", params.to.toString());
  }

  if (params.limit) {
    query.append("limit", params.limit.toString());
  }

  const response = await axios.get(`${API_URL}/v1/raw_mev?${query.toString()}`);

  return response.data.datapoints as Datapoint[];
}

export function useValidatorsWithStatsQuery(blocks: number) {
  return useQuery({
    queryKey: ["validators-with-stats", blocks],
    queryFn: async () => {
      const validators = await getValidators();

      const toHeight = await getLatestHeight();

      let fromHeight = toHeight - blocks;
      if (fromHeight < 0) {
        fromHeight = 1;
      }

      const statPromises = validators.map((validator) =>
        getValidatorStats(validator.pubkey, fromHeight, toHeight)
      );

      const stats = await Promise.all(statPromises);

      return validators.map((validator, index) => ({
        ...validator,
        averageMev: stats[index].averageMev,
        averageNormalizedMev: stats[index].averageNormalizedMev,
      }));
    },
    keepPreviousData: true,
  });
}

export function useValidatorsQuery() {
  return useQuery({
    queryKey: ["validators"],
    queryFn: async () => {
      return getValidators();
    },
    keepPreviousData: true,
  });
}

export function useNormalizedMEVQuery(proposer: string, blocks: number) {
  return useQuery({
    queryKey: ["normalized-mev", proposer, blocks],
    queryFn: async () => {
      const toHeight = await getLatestHeight();

      let fromHeight = toHeight - blocks;
      if (fromHeight < 0) {
        fromHeight = 1;
      }

      return getNormalizedMEV({
        proposers: [proposer],
        from: fromHeight,
        to: toHeight,
        limit: 1000,
      });
    },
    enabled: proposer !== "",
  });
}

export function useRawMEVQuery(proposer: string, blocks: number) {
  return useQuery({
    queryKey: ["raw-mev", proposer, blocks],
    queryFn: async () => {
      const toHeight = await getLatestHeight();

      let fromHeight = toHeight - blocks;
      if (fromHeight < 0) {
        fromHeight = 1;
      }

      return getRawMEV({
        proposers: [proposer],
        from: fromHeight,
        to: toHeight,
        limit: 1000,
      });
    },
    enabled: proposer !== "",
  });
}

export function useCumulativeNormalizedMEVQuery() {
  return useQuery({
    queryKey: ["cumulative-normalized-mev"],
    queryFn: async () => {
      const validators = await getValidators();

      const allDatapoints = await getNormalizedMEV({
        proposers: validators.map((v) => v.pubkey),
        limit: 1000,
      });

      const byValidator = allDatapoints.reduce((acc, datapoint) => {
        return {
          ...acc,
          [datapoint.proposer]: [...(acc[datapoint.proposer] ?? []), datapoint],
        };
      }, {} as Record<string, Datapoint[]>);

      return validators.map((validator) => {
        return {
          validator: validator.moniker,
          cumulativeNormalizedMEV: cumulativeDatapoints(
            byValidator[validator.pubkey] ?? []
          ),
        };
      });
    },
  });
}

export function cumulativeDatapoints(datapoints: Datapoint[]) {
  const reversedValues = [...datapoints].reverse();

  return reversedValues.map((_, index) => {
    return {
      key: reversedValues.length - index,
      value: reversedValues.slice(0, index + 1).reduce((acc, value) => {
        return acc + value.value * 10000;
      }, 0),
    };
  });
}
