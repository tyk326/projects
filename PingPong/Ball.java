public class Ball {
    public int x;
    public int y;
    private int w;
    private int h;

    public Ball(int x, int y, int w, int h){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
    }

    public int getX(){
        return x;
    }

    public int getY(){
        return y;
    }

    public int getHeight(){
        return h;
    }

    public int getWidth(){
        return w;
    }

    public void bounce(int x2, int y2){
        x+=x2;
        y+=y2;
    }
}
