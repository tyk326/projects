public class Block {
    private int xcoord;
    private int ycoord;
    private int width;
    private int height;

    public Block(int x, int y, int width, int height){
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
    public void horizontal(int x){
        if (xcoord+x<0 || xcoord+width+x>World.WIDTH) x=0;
        xcoord+=x;
    }
    public void vertical(int y){
        if (ycoord+y<0 || ycoord+height+y>World.HEIGHT) y=0;
        ycoord+=y;
    }
}
