import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class blockpanel extends JPanel implements KeyListener, ActionListener{
    private Block block=new Block(10,165,10,10);
    private boolean[] keys=new boolean[4]; //left,right,up,down and to have multiple keys pressed down at the same time
    private javax.swing.Timer timer;
    private Wall[] walls=new Wall[4];
    private int inc=5;
    String message="";
    
    public blockpanel(Color c){
        setBackground(c);
        setBorder(BorderFactory.createLineBorder(Color.BLACK));

        setFocusable(true);
        addKeyListener(this);

        timer=new javax.swing.Timer(20,this);
        timer.start();

        walls[0]=new Wall(80,20,20,160);
        walls[1]=new Wall(185,140,20,160);
        walls[2]=new Wall(290,60,20,160);
        walls[3]=new Wall(415,180,20,160);
    }

    @Override
    public void paintComponent(Graphics g){
        super.paintComponent(g);
        g.fillRect(block.getX(),block.getY(),block.getWidth(),block.getHeight());
        g.setColor(Color.BLACK);
        g.setColor(Color.RED);
        for (int i=0; i<walls.length; i++){
            g.fillRect(walls[i].getX(),walls[i].getY(),walls[i].getWidth(),walls[i].getHeight());
        }
        g.setColor(Color.BLACK); g.drawString(message,5,15);
    }
    public void keyPressed(KeyEvent e){
        if (e.getKeyCode()==KeyEvent.VK_LEFT){
            keys[0]=true;
        }
        if (e.getKeyCode()==KeyEvent.VK_RIGHT){
            keys[1]=true;
        }
        if (e.getKeyCode()==KeyEvent.VK_UP){
            keys[2]=true;
        }
        if (e.getKeyCode()==KeyEvent.VK_DOWN){
            keys[3]=true;
        }
    }
    public void keyReleased(KeyEvent e){
        if (e.getKeyCode()==KeyEvent.VK_LEFT){
            keys[0]=false;
        }
        if (e.getKeyCode()==KeyEvent.VK_RIGHT){
            keys[1]=false;
        }
        if (e.getKeyCode()==KeyEvent.VK_UP){
            keys[2]=false;
        }
        if (e.getKeyCode()==KeyEvent.VK_DOWN){
            keys[3]=false;
        }
    }
    public void keyTyped(KeyEvent e){}
    public void actionPerformed(ActionEvent e){
        if (keys[0]==true){
            block.horizontal(-5);
        }
        if (keys[1]){
            block.horizontal(5);
        }
        if (keys[2]){
            block.vertical(-5);
        }
        if (keys[3]){
            block.vertical(5);
        }

        for (int i=0; i<walls.length; i++){
            int wallx=walls[i].getX();
            int wally=walls[i].getY();
            int wallwidth=walls[i].getWidth();
            int wallheight=walls[i].getHeight();

            int blockx=block.getX();
            int blocky=block.getY();
            int blockwidth=block.getWidth();
            int blockheight=block.getHeight();

            if (wally+wallheight+inc>=World.HEIGHT){
                walls[i].inc=-1*walls[i].inc;
            }
            if (wally+inc<=0){
                walls[i].inc=-1*walls[i].inc;
            }
            walls[i].vertical(walls[i].inc);

            if (blockx+blockwidth>=wallx && blockx<=wallx+wallwidth && blocky<=wally+wallheight && blocky+blockheight>=wally) {timer.stop();}
        }

        if (block.getX()+block.getWidth()>=World.WIDTH){
            timer.stop();
        }

        message=block.getX()+", "+block.getY();

        repaint();
    }
}
