import javax.swing.*;
import java.awt.*;
import java.awt.event.*;


public class frame extends JFrame{
    private JPanel jp=new JPanel();
    private blockpanel bp=new blockpanel(Color.WHITE);

    public frame(){
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setTitle("Keys!");
        jp.setBackground(Color.CYAN);
        bp.setBounds(0,0,World.WIDTH,World.HEIGHT);
        jp.setPreferredSize(new Dimension(World.WIDTH,World.HEIGHT));
        jp.setLayout(null);

        jp.add(bp);
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
