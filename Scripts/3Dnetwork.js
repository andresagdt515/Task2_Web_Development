
            jgraph.create('.graph', {directed: true});
            $.getJSON('../Data/data3D.json', function (graph) {
                jgraph.draw(graph);
            });

            $('#toon').click(function () { jgraph.setShader('toon'); });
            $('#basic').click(function () { jgraph.setShader('basic'); });
            $('#phong').click(function () { jgraph.setShader('phong'); });
            $('#lambert').click(function () { jgraph.setShader('lambert'); });
        