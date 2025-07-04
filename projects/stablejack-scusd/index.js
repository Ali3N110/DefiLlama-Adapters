const { sumTokens2 } = require("../helper/unwrapLPs");
const ADDRESSES = require('../helper/coreAssets.json');

module.exports = {
  misrepresentedTokens: true,
  methodology:
    "TVL includes scUSD, stS, wOS, rsAVAX, savUSD, and wstkscUSD (converted to scUSD via convertToAssets) across Sonic and Avalanche chains.",
  sonic: {
    tvl: async (api) => {
      // Step 1: Static token-owner pairs (like sumTokensExport)
      const tokensAndOwners = [
        [ADDRESSES.sonic.scUSD, '0xf41ECda82C54745aF075B79b6b31a18dD986BA4c'], // scUSD
        [ADDRESSES.sonic.STS, '0x682D7F02BC57Bc64bfb36078454601Ba0Efbe155'], // stS
        ['0x9f0df7799f6fdad409300080cff680f5a23df4b1', '0x0A6F4c98D087445Ef92b589c6f39D22C4373615F'], // wOS
      ];
      await sumTokens2({ api, tokensAndOwners });

      // Step 2: Dynamic logic for wstkscUSD
      const wstkscUSD = '0x9fb76f7ce5fceaa2c42887ff441d46095e494206';
      const scUSD = '0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE';
      const vault = '0xb27f555175e67783ba16f11de3168f87693e3c8f';

      const balance = await api.call({
        abi: 'erc20:balanceOf',
        target: wstkscUSD,
        params: vault,
      });

      const valueInScUSD = await api.call({
        abi: 'function convertToAssets(uint256) view returns (uint256)',
        target: wstkscUSD,
        params: balance,
      });

      api.add(scUSD, valueInScUSD);
    },
  },
  avax: {
    tvl: sumTokens2({
      tokensAndOwners: [
        ['0xDf788AD40181894dA035B827cDF55C523bf52F67', '0xf010696e0BE614511516bE0DdB89AFf06B6cA440'], // rsAVAX
        ['0x06d47F3fb376649c3A9Dafe069B3D6E35572219E', '0xC37914DacF56418A385a4883512Be8b8279c94C5'], // savUSD
      ],
    }),
  },
};
