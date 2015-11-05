(function (env) {
    "use strict";
    env.ddg_spice_pubmed = function(api_result){
        if (!api_result || api_result.error) {
            return Spice.failed('pubmed');
        }
        api_result = api_result.esearchresult.idlist;
//        var url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&rettype=abstract&id=';
        var url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&rettype=abstract&retmax=2&id=';
        $.ajax({
            url: url + api_result.join(),
            async: false,
            dataType: 'json',
            success: function(r) {                                                                                             
                delete r.result.uids;
                api_result = r.result;
                var articles = Object.keys(api_result).map(function(key){return api_result[key]});
                api_result = articles;
            }
        });    


        Spice.add({
            id: "pubmed",
            name: "Pubmed",
            data: api_result,
            meta: {
                sourceName: "Pubmed",
                sourceUrl: 'http://www.ncbi.nlm.nih.gov/pubmed',
                rerender: [ 'description' ]
            },
            normalize: function(item) {
                var boxData = [{heading: 'Pubmed ID'}];
                if (item) {
                    boxData.push({
                        label: "Title",
                        value: item.title,
                    });
//                    boxData.push({
//                        label: "Abstract",
//                        value: "",
//                    });
                }

                return {
                    description: '',
                    infoboxData: boxData,
                }
            },
            onItemShown: function(item) {
                var url = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=text&rettype=abstract&id='+item.uid;
                if (item.loadedAbstract) { return; }

                $.ajax({
                    url: url,
                    dataType: 'text',
                    success: function(r) {
                        item.set('description', r);
                        console.log(item.description);
                    }
                });

                item.loadedAbstract = 1;
            },
            templates: {
                group: 'text'
            }
        });
    };
}(this));

