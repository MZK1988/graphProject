const CosmosClient = require("@azure/cosmos").CosmosClient;
const Gremlin = require("gremlin");
const config = require("./config");
const configGraph = require("./configGraph");

const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);
const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(
  `/dbs/${configGraph.database}/colls/${configGraph.collection}`,
  configGraph.primaryKey
);

const clientGraph = new Gremlin.driver.Client(configGraph.endpoint, {
  authenticator,
  traversalsource: "g",
  rejectUnauthorized: true,
  mimeType: "application/vnd.gremlin-v2.0+json",
});

function dropGraph() {
  console.log("Running Drop");
  return clientGraph.submit("g.V().drop()", {}).then(function (result) {
    console.log("Result: %s\n", JSON.stringify(result));
  });
}

//*********************************ADD VERTEX*******************************************************************************************************//
//*********************************MODIFY THIS FUNCTION TO PASS OBJECT VARIABLES****************************************************************** */
function addVertex1(npi) {
  console.log("Running Add Vertex1");
  return clientGraph
    .submit("g.addV(label).property('id', id).property('City','id')", {
      label: "NPI",
      id: npi,
    })
    .then(function (result) {
      console.log("Result: %s\n", JSON.stringify(result));
    });
}

//*********************************ADD VERTEX*******************************************************************************************************//
function addVertex2(procedureCode) {
  console.log("Running Add Vertex3");
  return clientGraph
    .submit("g.addV(label).property('id', id).property('City','id')", {
      label: "Procedure Type",
      id: procedureCode,
    })
    .then(function (result) {
      console.log("Result: %s\n", JSON.stringify(result));
    });
}

//*********************************ADD VERTEX*******************************************************************************************************//
function addVertex3(location) {
  console.log("Running Add Vertex2");
  return clientGraph
    .submit("g.addV(label).property('id', id).property('City','id')", {
      label: "Location",
      id: location,
    })
    .then(function (result) {
      console.log("Result: %s\n", JSON.stringify(result));
    });
}
//*********************************ADD EDGE ONE*******************************************************************************************************//
function addEdge1(npi, procedureCode) {
  console.log("Running Add Edge 1");
  return clientGraph
    .submit("g.V(source).addE(relationship).to(g.V(target))", {
      source: npi,
      relationship: "performs",
      target: procedureCode,
    })
    .then(function (result) {
      console.log("Result: %s\n", JSON.stringify(result));
    });
}

//*********************************ADD EDGE TWO*******************************************************************************************************//
function addEdge2(npi, location) {
  console.log("Running Add Edge 2");
  return clientGraph
    .submit("g.V(source).addE(relationship).to(g.V(target))", {
      source: npi,
      relationship: "Place of Business",
      target: location,
    })
    .then(function (result) {
      console.log("Result: %s\n", JSON.stringify(result));
    });
}

//*********************************COUNT VERTICES*******************************************************************************************************//
function countVertices() {
  console.log("Running Count");
  return clientGraph.submit("g.V().count()", {}).then(function (result) {
    console.log("Result: %s\n", JSON.stringify(result));
  });
}

//*********************************FINISH*******************************************************************************************************//
function finish() {
  console.log("Finished");
  console.log("Press any key to exit");

  process.stdin.resume();
  process.stdin.on("data", process.exit.bind(process, 0));
}

// console.log(database);

// query to return all items
const querySpec = {
  query: "SELECT TOP 10 * from c",
};

console.log(querySpec);

// // read all items in the Items container

dropGraph();
async function asyncCall() {
  try {
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
    items.forEach((item) => {
      //MAYBE PUSH THESE INTO ARRAYS OR OBJECTS?
      //This is where vertices and edges are created
      let npi = item["National Provider Identifier "];
      let procedureCode = item.HCPCS_CODE;
      let location = item["Street Address 1"];
      console.log(npi);
      console.log(procedureCode);
      console.log(location);
      clientGraph
        .open()
        .then(addVertex1(npi))
        .then(addVertex2(procedureCode))
        .then(addVertex3(location))
        .then(addEdge1(npi, procedureCode))
        .then(addEdge2(npi, location))
        .then(countVertices)
        .catch((err) => {
          console.error("Error running query...");
          console.error(err);
        })
        .then((res) => {
          clientGraph.close();
          finish();
        })
        .catch((err) => console.error("Fatal error:", err));
    });
  } catch (err) {
    console.error(err.message);
  }
}
asyncCall().then(console.log("Done with connecting to nonGraph DB"));
