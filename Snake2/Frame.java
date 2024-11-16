import javax.swing.*;
import java.awt.*;

public class Frame extends JFrame{
    private Game game=new Game(600, 600);

    public Frame(){
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setTitle("Snake Game");
        setVisible(true);

        game.setBackground(Color.BLACK);
        game.setBorder(BorderFactory.createLineBorder(Color.BLACK));
        game.setLayout(null);
        game.setFocusable(true);
        
        add(game);
        getContentPane().add(game);
        pack();
    }

    public void display() {
        EventQueue.invokeLater(new Runnable() {
          public void run() {
            setVisible(true);
          }
        });
      }
}
