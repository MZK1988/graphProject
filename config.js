// @ts-check

const config = {
  endpoint: "https://frauddetectsink.documents.azure.com:443/",
  key:
    "NEQSLrU3tkEngBXVriq8Lc1GDS206ZUWFYXeF8YBVBwNnu9tsiqqCYpYUILk7RfzgH7wkQttwa4BWYohiBgNFA==",
  databaseId: "fraudGraph",
  containerId: "fraudGraphRaw",
  partitionKey: { kind: "Hash", paths: ["/City"] },
};

module.exports = config;
