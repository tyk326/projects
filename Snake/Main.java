import javax.swing.*;
import java.awt.*;

public class Main{
    public static void main(String[] args){
        int boardWidth=600;
        int boardHeight=boardWidth;

        JFrame frame=new JFrame("Snake Game");
        frame.setVisible(true);
        frame.setLocationRelativeTo(null);
        frame.setResizable(false); //Can't change size of frame
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        SnakeGame snakeGame=new SnakeGame(boardWidth, boardHeight);
        frame.add(snakeGame);
        frame.getContentPane().add(snakeGame);
        frame.pack();
        snakeGame.requestFocus();
    }
}