package edu.lehigh.tyk326.backend;

// Import the Javalin package, so that we can make use of the "get" function to 
// create an HTTP GET route
import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.RowId;
import java.util.ArrayList;
import java.util.Scanner;

// Import Google's JSON library
import com.google.gson.*;

import edu.lehigh.tyk326.backend.Database.RowData;

/**
 * For now, our app creates an HTTP server that can only get and add data.
 * 
 * When an HTTP client connects to this server on the default Javalin port
 * (8080),
 * and requests /hello, we return "Hello World". Otherwise, we produce an error.
 */
public class App {
    public static void main(String[] args) {
        main_uses_database(args);
    }

    public static void main_uses_database(String[] args) {
        /* holds connection to the database created from environment variables */
        Database db = Database.getDatabase();
        // our javalin app on which most operations must be performed
        Javalin app = Javalin
                .create(
                    config -> {
                        config.requestLogger.http(
                            (ctx, ms) -> {
                                System.out.printf("%s%n", "=".repeat(42));
                                System.out.printf("%s\t%s\t%s%nfull url: %s%n", ctx.scheme(),
                                        ctx.method().name(), ctx.path(), ctx.fullUrl());
                            });

                            // set up static file serving. See:
                            //https://javalin.io/documentation#staticfileconfig
                            config.staticFiles.add(staticFiles -> {
                            staticFiles.hostedPath = "/"; // change to host files on a subpath, like '/assets'
                            String static_location_override = System.getenv("STATIC_LOCATION");
                            if (static_location_override == null) { // serve from jar; files located in src/main/resources/public
                                staticFiles.directory = "/public"; // the directory where your files are located
                                staticFiles.location = Location.CLASSPATH; // Location.CLASSPATH (jar)
                            } else { // serve from filesystem
                                System.out.println("Overriding location of static file serving using STATIC_LOCATION env var: " + static_location_override);
                                staticFiles.directory = static_location_override; // the directory where your files are located
                                staticFiles.location = Location.EXTERNAL; // Location.EXTERNAL (file system)
                                staticFiles.precompress = false; // if the files should be pre-compressed and cached in memory (optimization)
                            }
                        });
                    }
                );

        if ("True".equalsIgnoreCase(System.getenv("CORS_ENABLED"))) {
            final String acceptCrossOriginRequestsFrom = "*";
            final String acceptedCrossOriginRoutes = "GET,PUT,POST,DELETE,OPTIONS";
            final String supportedRequestHeaders = "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin";
            enableCORS(app, acceptCrossOriginRequestsFrom, acceptedCrossOriginRoutes, supportedRequestHeaders);
        }

        // gson provides us a way to turn JSON into objects, and objects into JSON.
        //
        // NB: it must be final, so that it can be accessed from our lambdas
        //
        // NB: Gson is thread-safe. See
        // https://stackoverflow.com/questions/10380835/is-it-ok-to-use-gson-instance-as-a-static-field-in-a-model-bean-reuse
        final Gson gson = new Gson();
        
        /* ----- the server routing logic will go here ----- */
        app.get("/songs", ctx -> {
            ctx.status(200); // status 200 OK
            ctx.contentType("application/json"); // MIME type of JSON
            StructuredResponse resp = new StructuredResponse("ok", null, db.selectAll());
            ctx.result(gson.toJson(resp)); // return JSON representation of response
        });

        app.get("/songs/{id}", ctx -> {
            // NB: the {} syntax "/songs/{id}" does not allow slashes ('/') as part of the
            // parameter
            // NB: the <> syntax "/songs/<id>" allows slashes ('/') as part of the parameter
            int idx = Integer.parseInt(ctx.pathParam("id"));

            // NB: even on error, we return 200, but with a JSON object that describes the
            // error.
            ctx.status(200); // status 200 OK
            ctx.contentType("application/json"); // MIME type of JSON

            RowData data = db.selectOne(idx);
            StructuredResponse resp = null;
            if (data == null) { // row not found, so return an error response
                resp = new StructuredResponse("error", "Data with row id " + idx + " not found", null);
            } else { // we found it, so just return the data
                resp = new StructuredResponse("ok", null, data);
            }

            ctx.result(gson.toJson(resp)); // return JSON representation of response
        });

        app.post("/songs", ctx -> {
            // NB: even on error, we return 200, but with a JSON object that describes the
            // error.
            ctx.status(200); // status 200 OK
            ctx.contentType("application/json"); // MIME type of JSON
            StructuredResponse resp = null;

            // get the request json from the ctx body, turn it into SimpleRequest instance
            // NB: if gson.Json fails, expect server reply with status 500 Internal Server
            // Error
            SimpleRequest req = gson.fromJson(ctx.body(), SimpleRequest.class);

            // NB: add to MockDataStore; createEntry checks for null title and message
            int newId = db.insertRow(req.mMessage());
            if (newId == -1) {
                resp = new StructuredResponse("error", "error performing insertion (title or message null?)", null);
            } else {
                resp = new StructuredResponse("ok", Integer.toString(newId), null);
            }
            ctx.result(gson.toJson(resp)); // return JSON representation of response
        });

        app.put("/songs/{id}", ctx -> {
            // If we can't get an ID or can't parse the JSON, javalin sends a status 500
            int idx = Integer.parseInt(ctx.pathParam("id"));

            // NB: even on error, we return 200, but with a JSON object that describes the
            // error.
            ctx.status(200); // status 200 OK
            ctx.contentType("application/json"); // MIME type of JSON
            StructuredResponse resp = null;

            // get the request json from the ctx body, turn it into SimpleRequest instance
            // NB: if gson.Json fails, expect server reply with status 500 Internal Server
            // Error
            SimpleRequest req = gson.fromJson(ctx.body(), SimpleRequest.class);

            // NB: update entry in MockDataStore; updateOne checks for null title and
            // message and invalid ids
            int result = db.updateOne(idx, req.mMessage());
            if (result == -1) {
                resp = new StructuredResponse("error", "unable to update row " + idx, null);
            } else {
                resp = new StructuredResponse("ok", null, result);
            }
            ctx.result(gson.toJson(resp)); // return JSON representation of response
        });

        app.delete("/songs/{id}", ctx -> {
            // If we can't get an ID or can't parse the JSON, javalin sends a status 500
            int idx = Integer.parseInt(ctx.pathParam("id"));

            // NB: even on error, we return 200, but with a JSON object that describes the
            // error.
            ctx.status(200); // status 200 OK
            ctx.contentType("application/json"); // MIME type of JSON
            StructuredResponse resp = null;

            // NB: we won't concern ourselves too much with the quality of the
            // message sent on a successful delete
            int result = db.deleteRow(idx);
            if (result == -1) {
                resp = new StructuredResponse("error", "unable to delete row " + idx, null);
            } else {
                resp = new StructuredResponse("ok", null, null);
            }
            ctx.result(gson.toJson(resp)); // return JSON representation of response
        });

        // don't forget: nothing happens until we `start` the server
        // app.start( /*default is 8080*/ );
        app.start(getIntFromEnv("PORT", DEFAULT_PORT_WEBSERVER));
        /*
         * if( db != null )
         * db.disconnect();
         */
    }

    /** The default port our webserver uses. We set it to Javalin's default, 8080 */
    public static final int DEFAULT_PORT_WEBSERVER = 8080;

    /**
     * Safely gets integer value from named env var if it exists, otherwise returns
     * default
     * 
     * @envar The name of the environment variable to get.
     * @defaultVal The integer value to use as the default if envar isn't found
     * 
     * @returns The best answer we could come up with for a value for envar
     */
    static int getIntFromEnv(String envar, int defaultVal) {
        if (envar == null || envar.length() == 0 || System.getenv(envar.trim()) == null)
            return defaultVal;
        try (Scanner sc = new Scanner(System.getenv(envar.trim()))) {
            if (sc.hasNextInt())
                return sc.nextInt();
            else
                System.err.printf("ERROR: Could not read %s from environment, using default of %d%n", envar,
                        defaultVal);
        }
        return defaultVal;
    }

    /**
     * Set up CORS headers for the OPTIONS verb, and for every response that the
     * server sends. This only needs to be called once.
     * 
     * @param app     the Javalin app on which to enable cors; create() already
     *                called on it
     * @param origin  The server that is allowed to send requests to this server
     * @param methods The allowed HTTP verbs from the above origin
     * @param headers The headers that can be sent with a request from the above
     *                origin
     */
    private static void enableCORS(Javalin app, String origin, String methods, String headers) {
        System.out.println("!!! CAUTION: ~~~ ENABLING CORS ~~~ !!!");
        app.options("/*", ctx -> {
            String accessControlRequestHeaders = ctx.req().getHeader("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                ctx.res().setHeader("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = ctx.req().getHeader("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                ctx.res().setHeader("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            String accessControlAllowOrigin = ctx.req().getHeader("Access-Control-Allow-Origin");
            if (accessControlAllowOrigin != null) {
                ctx.res().setHeader("Access-Control-Allow-Origin", accessControlAllowOrigin);
            }
        });

        // 'before' is a decorator, which will run before any get/post/put/delete.
        // In our case, it will put three extra CORS headers into the response
        app.before(handler -> {
            handler.header("Access-Control-Allow-Origin", origin);
            handler.header("Access-Control-Request-Method", methods);
            handler.header("Access-Control-Allow-Headers", headers);
        });
    }
}