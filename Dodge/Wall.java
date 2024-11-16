public class Wall{
    private int xcoord; private int ycoord;
    private int width; private int height;
    public int inc=5;

    public Wall(int x, int y, int width, int height){
        xcoord=x;
        ycoord=y;
        this.width=width;
        this.height=height;
    }

    public int getX(){
        return xcoord;
    }
    public int getY(){
        return ycoord;
    }
    public int getWidth(){
        return width;
    }
    public int getHeight(){
        return height;
    }
    public int getInc(){
        return inc;
    }
    public void vertical(int y){
        ycoord+=y;
    }
}
