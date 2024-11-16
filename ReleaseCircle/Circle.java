public class Circle {
    private int x;
    private int y;

    public Circle(int x, int y){
        this.x=x;
        this.y=y;
    }

    public int getX(){
        return x;
    }

    public int getY(){
        return y;
    }

    public void bounce(int x2, int y2){
        x+=x2/9;
        y+=y2/9;
    }
}