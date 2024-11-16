import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.util.ArrayList;
import java.util.Random;

public class Game extends JPanel implements ActionListener, KeyListener{
    private int boardwidth, boardheight;
    private int tilesize=25;

    Tile head=new Tile(5,5);

    public Game(int boardwidth, int boardheight){
        this.boardwidth=boardwidth; this.boardheight=boardheight;
        setPreferredSize(new Dimension(boardwidth, boardheight));
        addKeyListener(this);
    }

    @Override
    public void paintComponent(Graphics g){
        super.paintComponent(g);
        for (int i=0; i<boardwidth/tilesize; i++){
            g.drawLine(tilesize*i,0,tilesize*i,boardheight);
            g.drawLine(0, tilesize*i,boardwidth,tilesize*i);
        }
    }
    public void keyPressed(KeyEvent e){

    }
    public void keyReleased(KeyEvent e){
    }
    public void keyTyped(KeyEvent e){}
    public void actionPerformed(ActionEvent e){

    }
}
