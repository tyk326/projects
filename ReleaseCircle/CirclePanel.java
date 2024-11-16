import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class CirclePanel extends  JPanel implements MouseListener, MouseMotionListener, ActionListener{
    private Circle circle=new Circle(World.WIDTH/2,World.HEIGHT/2);
    int x1; int y1; int x2=World.WIDTH/2; int y2=World.HEIGHT/2; int xpos; int ypos;
    private javax.swing.Timer timer;
    private JLabel message=new JLabel("");

    public CirclePanel(Color c){
        setBackground(c);
        setBorder(BorderFactory.createLineBorder(Color.BLACK));
        addMouseMotionListener(this);
        addMouseListener(this);

        timer=new javax.swing.Timer(50,this);
    }

    @Override
    public void paintComponent(Graphics g){
        super.paintComponent(g);
        if (!timer.isRunning()){
            x1=World.WIDTH/2;
            y1=World.HEIGHT/2;
            g.drawLine(x1,y1,x2,y2);
            g.fillOval(World.WIDTH/2-10,World.HEIGHT/2-10,20,20);
            g.setColor(Color.GRAY);
        }
        else{
            g.fillOval(circle.getX()-10,circle.getY()-10,20,20);
        }
    }

    public void mouseEntered(MouseEvent e){}
    public void mousePressed(MouseEvent e){}
    public void mouseReleased(MouseEvent e){
        message.setText("");
        timer.start();
        repaint();
    }
    public void mouseExited(MouseEvent e){
    }
    public void mouseClicked(MouseEvent e){
        if (e.getButton()==MouseEvent.BUTTON3){
            x1=x2=World.WIDTH/2; y1=y2=World.HEIGHT/2;
            circle=new Circle(World.WIDTH/2, World.HEIGHT/2);
            timer.stop();
        }
        repaint();
    }
    public void mouseDragged(MouseEvent e){
        if (!timer.isRunning()){
            x2=e.getX();
            y2=e.getY();
            xpos=World.WIDTH/2-x2;
            ypos=World.HEIGHT/2-y2;
            message.setText(xpos+","+ypos); //doing message.setbounds() won't work for some reason
            add(message);
            repaint();
        }
    }
    public void mouseMoved(MouseEvent e){}
    public void actionPerformed(ActionEvent e){
        if (circle.getX()-10<0 || circle.getX()+10>500){
            xpos=-1*xpos;
        }
        if (circle.getY()-10<0 || circle.getY()+10>350){
            ypos=-1*ypos;
        }
        circle.bounce(xpos,ypos);
        repaint();
    }
}
