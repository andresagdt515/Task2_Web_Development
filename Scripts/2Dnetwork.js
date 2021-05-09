var canvas = d3.select("#network"), //generate canvas in previously stated network
        width = canvas.attr("width"),
        height = canvas.attr("height"),
        ctx = canvas.node().getContext("2d"), // generate context for our canvas
        r = 10, //radius length
        color = d3.scaleOrdinal(d3.schemeCategory20),
        simulation = d3.forceSimulation() // create simulation forces
            .force("x", d3.forceX(width/2)) // force to bring to the middle of page, in x axis
            .force("y", d3.forceY(height/2)) // force to bring to the middle of page, in y axis
            .force("collide", d3.forceCollide(r+1)) // force to avoid nodes to collide
            .force("charge", d3.forceManyBody() // force FAAALTAAA
            .strength(-700))
            .force("link", d3.forceLink()
            .id(function (d) { return d.id; }));
        
        
        d3.json("../Task2_Web_Development/Data/data2D.json", function (err, graph) { // load data
        if (err) throw err;
        
        simulation.nodes(graph.nodes); // create node elements in simulation
        simulation.force("link") // create edge streuctures in simulation
            .links(graph.edges);
        simulation.on("tick", update);
        
        canvas
            .call(d3.drag() // dragging of nodes
                .container(canvas.node())
                .subject(dragsubject)
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        
        function update() { 
            ctx.clearRect(0, 0, width, height); // function that will clear the whole canvas
        
            ctx.beginPath(); // let's begin the drawing of nodes and edges
            ctx.globalAlpha = 1; 
            ctx.strokeStyle = "#000000"; // black links
            graph.edges.forEach(drawLink); // designs edges with arrows using drawLink
            ctx.stroke(); //draws edges with arrows
        
            ctx.globalAlpha = 1.0;
            graph.nodes.forEach(drawNode);// design and draw nodes using drawNode
        }
        
        function dragsubject() {
            return simulation.find(d3.event.x, d3.event.y); // display  node information in JavaScript console when clicking on a node
        }
        
        });
        
        function dragstarted() { // The following 3 functions are in charge of the dragging effect. They control the start of the dragging, its event and its end
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d3.event.subject.fx = d3.event.subject.x;
                d3.event.subject.fy = d3.event.subject.y;
                console.log("Node_id:", d3.event.subject.id, "\nNode_label:", d3.event.subject.label);
        }

        function dragged() {
            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;
        }
        
        function dragended() {
            if (!d3.event.active) simulation.alphaTarget(0);
            d3.event.subject.fx = null;
            d3.event.subject.fy = null;
        }
        
        function drawNode(d) { // function to design and draw nodes, receives an element d
            ctx.beginPath();

            var c = d.color.slice(2); // since color code from data needs to be a 6 digit code,
                                      // without including the initial 0x. For that we first remove 
                                      //this 0x creating a substring
        
            while (c.length < 6){ // then we check if the substring has less than 6 digit length. 
                                 // If so then we add a 0 at the beginning.
                c = "0" + c;   
            }
            
            c = "#" + c // Finally, we add the # at the beginning of c to have our final hex code, ready for drawing the node.
            
            ctx.fillStyle = c; // set the color to node
            ctx.moveTo(d.x, d.y); // move cursor to (x,y)
            ctx.arc(d.x, d.y, r, 0, Math.PI*2); // draw circle centered in (x,y)
            ctx.fill(); // fillcircle with previously selected color
        }

        function findCircleLineIntersections(r, h, k, m, n) { // This function returns the x coordinates of points P0=(x0,y0) and P1=(x1,y1), 
                                                              // that are the 2 intersections of a line crossing a circle
            var a = 1 + (m)**2;
            var b = -h * 2 + (m * (n - k)) * 2;
            var c = h**2 + (n - k)**2 - (r)**2;
        
            var d = (b)**2 - 4 * a * c;
            if (d >= 0) {
               
                var intersections = [
                    (-b + Math.sqrt((b)**2 - 4 * a * c)) / (2 * a),
                    (-b - Math.sqrt((b)**2 - 4 * a * c)) / (2 * a)
                ];
                if (d == 0) {
                    // only 1 intersection
                    return [intersections[0]];
                }
                return intersections;
            }
            return [];
        }
        function canvas_arrow(context, fromx, fromy, tox, toy) { // This function creates an arrow at the end of the link. 
                                                                 // But since nodes are opaque, the arrow overlaps with the node and can't be well distinguished.
                                                                 //This is why I implement the function findCircleLineIntersections, to have the surface-node-point
                                                                 //  where the edge crosses the node and then setting the tox and toy coordinates of the arrow  in that point.
            var headlen = 10; // length of head in pixels
            var dx = tox - fromx;
            var dy = toy - fromy;
            var angle = Math.atan2(dy, dx);
            context.moveTo(fromx, fromy);
            context.lineTo(tox, toy);
            context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
            context.moveTo(tox, toy);
            context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
          }
          
        function drawLink(l) { // function to design links with arrows, receives an element l
            var m = (l.target.y - l.source.y)/(l.target.x - l.source.x);
            var n = l.target.y - l.target.x * m;
            var xf = 0;
            
            pos = findCircleLineIntersections(r, l.target.x, l.target.y, m, n); // pos stores x0 and x1

            if (Math.abs(l.source.x - pos[0]) < Math.abs(l.source.x - pos[1])){ // We need to choose either P0 or P1 to tell the arrow to draw.
                                                                                // We will choose the one that is nearer to the source point.
                xf = pos[0];
            }else{
                xf = pos[1]
            }
            var yf = m*(xf-l.target.x) + l.target.y; // and then, once the x coordinate is selected, we calculate the y coordinate from line equation

            canvas_arrow(ctx, l.source.x, l.source.y, xf, yf) // And finally we design edge + arrows
        };
        