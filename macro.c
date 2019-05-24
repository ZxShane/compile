#include<math.h>
#define M(x,y) x*y+1
#define N 10
int main(){
int a,b;
int c;
a = 1;
b = N;
c = M(a,b);
write(c);
printf("\n");
c=max(a,b);
write(c);
return 0;
}
