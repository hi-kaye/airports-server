const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const airports = require("./airports.json");
const Airport = require('./Airport')
const YAML = require("js-yaml");
const fs = require("fs");
const docs = YAML.load(fs.readFileSync("./airports_config.yaml").toString());
const swaggerDocs = require("swagger-jsdoc")({
  swaggerDefinition: docs,
  apis: ["./server.js", "./Airport.js"],
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: true })
);
app.use(express.json());
/**
 * @swagger
 * /airports:
 *   get:
 *     summary: returns an array of airports
 *     parameters:
 *     - name: pageSize
 *       in: query
 *       schema:
 *          type: integer
 *          minimum: 1
 *          maximum: 100
 *          default: 25
 *       required: false
 *       description: The number of items to return
 *     - name: page
 *       in: query
 *       schema:
 *          type: integer
 *       required: required
 *       description: Page number
 *     responses:
 *       200:
 *         description: all the airports
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 */

/* app.get("/airports", (req, res) => {
  res.send(airports);
}); */

app.get("/airports", (req, res) => {
  let page = req.query.page
  let pageSize = req.query.pageSize

  let min = (page - 1) * pageSize
  let max = page * pageSize 
 
  res.status(200).send(airports.slice(min, max))

})
/**
 * @swagger
 * /airports:
 *    post:
 *     summary: Create a new airport
 *     description: Add to the list of airports using this route
 *     requestBody:
 *       content:
 *         'application/json':
 *           schema:
 *              $ref: '#/components/schemas/Airport'
 *       required: true
 *     responses:
 *       201:
 *         description: Resource created successfully
 *         content:
 *           'application/json':
 *              schema:
 *                  $ref: '#/components/schemas/Airport'
 *       400:
 *         description: Bad request
 *         content:
 *           'application/json': {}
 */
app.post("/airports", (req, res) => {
  let airport = new Airport(req.body)
  airports.push(airport)
  res.status(201).send(airport)
  });

/**
 * @swagger
 * /airports:
 *    put:
 *     summary: Updates existing airport
 *     description: Updates airport using this route
 *     requestBody:
 *       content:
 *         'application/json':
 *           schema:
 *              $ref: '#/components/schemas/Airport'
 *       required: true
 *     responses:
 *       202:
 *         description: Accepted
 *         content:
 *           'application/json':
 *              schema:
 *                  $ref: '#/components/schemas/Airport'
 */
app.put("/airports/:icao", (req, res) => {
  const icao = req.params.icao
  const index = airports.findIndex(el => (el.icao) === icao)
  const airport = airports[index]
  const updates = req.body
  //enumerate thru json
  for (let i in updates) {
    airport[i] = updates[i]
    } 
  
  console.log(airport)
  res.status(202).send(airport)
  })

/**
 * @swagger
 * /airports/{icao}:
 *    get:
 *     summary: Find airport by ICAO
 *     description: Find airport using ICAO
 *     parameters:
 *     - name: icao
 *       in: path
 *       description: ICAO of airport to return
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           'application/json':
 *              schema:
 *                  $ref: '#/components/schemas/Airport'
 *       400:
 *         description: Invalid ICAO supplied
 *         content:
 *           'application/json': {}
 *       404:
 *         description: Pet not found
 *         content:
 *           'application/json': {}
 */
app.get('/airports/:icao', (req, res) => {
    const icao = req.params.icao
    const index = airports.findIndex(element => element.icao === icao)
    console.log(airports[index])
    res.status(200).send(airports[index])
})
/**
 * @swagger
 * /airports/{icao}:
 *   delete:
 *     summary: Deletes an airport
 *     parameters:
 *     - name: icao
 *       in: path
 *       description: ICAO to delete
 *       required: true
 *       schema:
 *         type: string
 *     description: Delete airports using this route
 *     responses:
 *       202:
 *         description: Deleted
 */
app.delete('/airports/:icao/delete', (req, res) => {
    const icao = req.params.icao
    const index = airports.findIndex(el => (el.icao) === icao)
    delete airports[index]
    res.status(202).send()
})
//app.listen(3000, () => console.log("Airport API ready. Documents at http://localhost:3000/api-docs"))
module.exports = app;
