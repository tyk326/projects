import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class mainframe extends JFrame{
    private JPanel jp=new JPanel();
    private CirclePanel cp=new CirclePanel(Color.WHITE);

    public mainframe(){
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setTitle("Circle Bouncing!");
        jp.setBackground(Color.CYAN);
        cp.setBounds(0,0,500,350);
        jp.setPreferredSize(new Dimension(World.WIDTH,World.HEIGHT));
        jp.setLayout(null);

        jp.add(cp);
        getContentPane().add(jp);
        pack();

    }

    public void display(){
        EventQueue.invokeLater(new Runnable() {
            public void run() {
              setVisible(true);
            }
        });
    }
}
