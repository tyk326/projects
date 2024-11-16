import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class PingPanel extends JPanel implements KeyListener, ActionListener{
    private boolean[] left=new boolean[2]; //down and to have multiple keys pressed down at the same time
    private boolean[] right=new boolean[2];
    private javax.swing.Timer timer;
    private Wall wall1=new Wall(10,225,10,50);
    private Wall wall2=new Wall(470,225,10,50);
    Ball ball=new Ball(243,168,17,17);
    String message="";
    int leftscore=0;
    int rightscore=0;
    int xmove=2;
    int ymove=2;
    JLabel score=new JLabel(leftscore+" : "+rightscore);
    JLabel pause=new JLabel("");
    
    public PingPanel(Color c){
        setBackground(c);
        setBorder(BorderFactory.createLineBorder(Color.BLACK));

        setFocusable(true);
        addKeyListener(this);

        score.setBounds(240,10,20,10);
        pause.setBounds(240,50,20,10);

        Font f=new Font("SansSerif",Font.BOLD, 30);
        score.setFont(f);
        pause.setFont(f);

        add(pause);
        add(score);

        timer=new javax.swing.Timer(5,this);

    }

    @Override
    public void paintComponent(Graphics g){
        super.paintComponent(g);
        g.setColor(Color.BLACK);
        g.fillOval(ball.getX(), ball.getY(), ball.getWidth(), ball.getHeight());
        g.setColor(Color.RED);
        g.fillRect(wall1.getX(),wall1.getY(),wall1.getWidth(),wall1.getHeight());
        g.fillRect(wall2.getX(),wall2.getY(),wall2.getWidth(),wall2.getHeight());
        score.setText(leftscore+" : "+rightscore);
    }
    public void keyPressed(KeyEvent e){
        if (e.getKeyCode()==KeyEvent.VK_SPACE){
            pause.setText("");
            timer.start();
        }
        if (e.getKeyCode()==KeyEvent.VK_ESCAPE){
            ball.x=243; ball.y=168;
            repaint();
            timer.stop();
        }
        if (e.getKeyCode()==KeyEvent.VK_W){
            left[0]=true;
        }
        if (e.getKeyCode()==KeyEvent.VK_S){
            left[1]=true;
        }
        if (e.getKeyCode()==KeyEvent.VK_UP){
            right[0]=true;
        }
        if (e.getKeyCode()==KeyEvent.VK_DOWN){
            right[1]=true;
        }
    }
    public void keyReleased(KeyEvent e){
        if (e.getKeyCode()==KeyEvent.VK_W){
            left[0]=false;
        }
        if (e.getKeyCode()==KeyEvent.VK_S){
            left[1]=false;
        }
        if (e.getKeyCode()==KeyEvent.VK_UP){
            right[0]=false;
        }
        if (e.getKeyCode()==KeyEvent.VK_DOWN){
            right[1]=false;
        }
    }
    public void keyTyped(KeyEvent e){}
    public void actionPerformed(ActionEvent e){
        if (left[0]){
            wall1.vertical(-5);
        }
        if (left[1]){
            wall1.vertical(5);
        }
        if (right[0]){
            wall2.vertical(-5);
        }
        if (right[1]){
            wall2.vertical(5);
        }

        int lx=wall1.getX(); int ly=wall1.getY();
        int lw=wall1.getWidth(); int lh=wall1.getHeight();

        int rx=wall2.getX(); int ry=wall2.getY();
        /*int rw=wall2.getWidth();*/ int rh=wall2.getHeight();

        int bx=ball.getX(); int by=ball.getY(); int bw=ball.getWidth(); int bh=ball.getHeight();

        if ((bx<=lx+lw && by+bh<=ly+lh && by>=ly) || (bx+bw>=rx && by+bh<=ry+rh && by>=ry)) xmove*=-1;
        if (by<0 || by+bh>World.HEIGHT) ymove*=-1;

        if (bx+xmove<0) {leftscore++; ball.x=243; ball.y=168;}
        if (bx+bw+xmove>World.WIDTH) {rightscore++; ball.x=243; ball.y=168;}

        ball.bounce(xmove,ymove);

        repaint();
    }
}
