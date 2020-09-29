var configGraph = {};

configGraph.endpoint =
  "wss://fraudgraph.gremlin.cosmosdb.azure.com:443/gremlin";
configGraph.primaryKey =
  "XSd5KzqwgV3PVD95dfXAcvpysCgtuxOPbUvZ295PYrb3iSzg9QMTOH0vOcVyIAJUHRJv87JWZmvI8cMQbefdKQ==";
configGraph.database = "fraudGraph";
configGraph.collection = "fraudPositivesOne";

module.exports = configGraph;
