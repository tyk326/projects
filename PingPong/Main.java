import javax.swing.*;
import java.awt.*;

public class Main {
    public static void main(String[] args){
        frame x=new frame();
        x.display();
    }

    private static class frame extends JFrame{
        private JPanel jp=new JPanel();
        private PingPanel pp=new PingPanel(Color.WHITE);

        public frame(){
            setDefaultCloseOperation(EXIT_ON_CLOSE);
            setTitle("Keys!");
            jp.setVisible(true);
            jp.setBackground(Color.CYAN);
            pp.setBounds(0,0,World.WIDTH,World.HEIGHT);
            jp.setPreferredSize(new Dimension(World.WIDTH,World.HEIGHT));
            jp.setLayout(null); //to put components on the screen

            jp.add(pp);
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
}
