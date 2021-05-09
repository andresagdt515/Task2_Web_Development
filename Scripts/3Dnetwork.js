
            jgraph.create('.graph', {directed: true}); //draw 3D directed network using jgraph's create function
            $.getJSON('../Task2_Web_Development/Data/data3D.json', function (graph) { // loading data
                jgraph.draw(graph);
            });

            // $('#toon').click(function () { jgraph.setShader('toon'); });
            // $('#basic').click(function () { jgraph.setShader('basic'); });
            // $('#phong').click(function () { jgraph.setShader('phong'); });
            // $('#lambert').click(function () { jgraph.setShader('lambert'); });
        