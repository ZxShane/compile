int main(){
int a;
a = 5;
if(a==5){
printf("a==5\n");
}else{
printf("a!=5");
}

switch(a){
case 5:
printf("in switch a == 5\n");
break;
case 6:
printf("in switch a == 6\n");
break;
default:
printf("in switch a == ?\n");
}
return 0;
}
