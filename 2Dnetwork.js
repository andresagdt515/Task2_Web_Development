var canvas = d3.select("#network"),
        width = canvas.attr("width"),
        height = canvas.attr("height"),
        ctx = canvas.node().getContext("2d"),
        r = 10,
        color = d3.scaleOrdinal(d3.schemeCategory20),
        simulation = d3.forceSimulation()
            .force("x", d3.forceX(width/2))
            .force("y", d3.forceY(height/2))
            .force("collide", d3.forceCollide(r+1))
            .force("charge", d3.forceManyBody()
            .strength(-700))
            .force("link", d3.forceLink()
            .id(function (d) { return d.id; }));
        
        
        d3.json("data.json", function (err, graph) {
        if (err) throw err;
        
        simulation.nodes(graph.nodes);
        simulation.force("link")
            .links(graph.edges);
        simulation.on("tick", update);
        
        canvas
            .call(d3.drag()
                .container(canvas.node())
                .subject(dragsubject)
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        
        function update() {
            ctx.clearRect(0, 0, width, height);
        
            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "#000000";
            graph.edges.forEach(drawLink);
            ctx.stroke();
        
        
            ctx.globalAlpha = 1.0;
            graph.nodes.forEach(drawNode);
        }
        
        function dragsubject() {
            return simulation.find(d3.event.x, d3.event.y);
        }
        
        });
        
        function dragstarted() {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d3.event.subject.fx = d3.event.subject.x;
                d3.event.subject.fy = d3.event.subject.y;
                console.log(d3.event.subject);
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
        
        function drawNode(d) {
            ctx.beginPath();

            var c = d.color.slice(2);
        
            while (c.length < 6){
                c = "0" + c;   
            }
            
            c = "#" + c
            
            
            
            ctx.fillStyle = c;
            ctx.moveTo(d.x, d.y);
            ctx.arc(d.x, d.y, r, 0, Math.PI*2);
            ctx.fill();
        }
        function findCircleLineIntersections(r, h, k, m, n) {
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
        function canvas_arrow(context, fromx, fromy, tox, toy) {
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
          
        function drawLink(l) {// function to draw links, receives a link l
            var m = (l.target.y - l.source.y)/(l.target.x - l.source.x);
            var n = l.target.y - l.target.x * m;
            var xf = 0;
            
            pos = findCircleLineIntersections(r, l.target.x, l.target.y, m, n);

            if (Math.abs(l.source.x - pos[0]) < Math.abs(l.source.x - pos[1])){
                xf = pos[0];
            }else{
                xf = pos[1]
            }
            var yf = m*(xf-l.target.x) + l.target.y;

            canvas_arrow(ctx, l.source.x, l.source.y, xf, yf)
        };
        