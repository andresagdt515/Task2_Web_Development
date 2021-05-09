
            jgraph.create('.graph', {directed: true}); // look for the the graph class to select the place where I will draw the 3D network
            $.getJSON('../Task2_Web_Development/Data/data3D.json', function (graph) { // loading data
                jgraph.draw(graph); //draw 3D directed network using jgraph's create function
            });
        