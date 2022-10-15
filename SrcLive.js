function Live() {
    addListener("onClose", $.toString(() => {
        //clearMyVar('guanlicz');
    }));
    
    var d = [];
    let livefile = "hiker://files/rules/Src/Juying/live.txt";
    let JYlive=fetch(livefile);
    if(JYlive){
        var JYlives = JYlive.split('\n');
    }else{
        var JYlives = [];
    }
    if(JYlives.length>0){
        d.push({
            title: '<b>聚直播</b> &nbsp &nbsp <small> 聚直播设置 </small>',
            img: "",
            url: "",
            col_type: 'avatar'
        });
        let datalist = [];
        let datalist2 = [];
        let group = "";
        for(let i=0;i<JYlives.length;i++){
            if(JYlives[i].indexOf('#genre#')>-1){
                group = JYlives[i].split(',')[0];
            }else if(JYlives[i].indexOf(',')>-1){
                datalist.push({group: group, name: JYlives[i].split(',')[0]});
            }
        }
        let obj = {};
        datalist = datalist.reduce((newArr, next) => {
            obj[next.name] ? "" : (obj[next.name] = true && newArr.push(next));
            return newArr;
        }, []);
        let grouplist = datalist.map((list)=>{
            return list.group;
        })

        function uniq(array){
            var temp = []; 
            for(var i = 0; i < array.length; i++){
                if(temp.indexOf(array[i]) == -1){
                    temp.push(array[i]);
                }
            }
            return temp;
        }
        grouplist = uniq(grouplist);
        for(var i in grouplist){
            let lists = datalist.filter(item => {
                return item.group==grouplist[i];
            })
            
            d.push({
                title: grouplist[i],
                url: $('#noLoading#').lazyRule(()=>{
                        
                        return'hiker://empty';
                    }),
                col_type: "scroll_button",
                extra: {
                    id: grouplist[i]
                }
            });
            if(i==0){
                datalist2 = lists;
            }
        }

        datalist = datalist2;
        //writeFile(livefile, "");
        for (let i=0;i<datalist.length;i++) {
            d.push({
                title: datalist[i].name,
                img: 'https://lanmeiguojiang.com/tubiao/more/228.png',
                col_type: 'icon_2_round',
                url: ""
            });
        }
        d.push({
            title: '<br>',
            col_type: 'rich_text'
        });
    }else{
        d.push({
            title: '没有直播数据源',
            col_type: 'rich_text'
        });
    }
    setHomeResult(d);
}