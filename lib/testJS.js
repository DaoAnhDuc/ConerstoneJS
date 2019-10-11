const arr = ["aaa","bbb", "c", "sss", "ccc", "sss","bbb", "c", "sss", "ccc"];
let x = (arr) => arr.filter((v,i) => arr.indexOf(v) === i);
const list = x(arr);

for(let j = 0; j < list.length; j++ ){
    list[j] =[];
    for(let i = 0; i < arr.length; i++){
        if(arr[i] == list[j]){
            list[j][j].push(arr[i])
        }
    }
}



