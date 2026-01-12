import torch
from torch import nn, optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

import random
import matplotlib.pyplot as plt
from torchvision.transforms.functional import to_pil_image

def getModel():
    return nn.Sequential(
        nn.Conv2d(3, 32, 3, 1, 1), # first layer. (input channels (r,g,b), output channels (features), kernel size (window that slides over the image), stride (moves 1 pixel at a time), padding (1-pixel border so output size stays the same as the input size))
        nn.ReLU(),
        nn.MaxPool2d(2), # (kernel size and stride). Cuts the height and width of the image in half. The image started as 128x128
        nn.Conv2d(32, 64, 3, 1, 1), # second layer
        nn.ReLU(),
        nn.MaxPool2d(2),
        nn.Conv2d(64, 128, 3, 1, 1), # third layer
        nn.ReLU(),
        nn.MaxPool2d(2),
        nn.Conv2d(128, 256, 3, 1, 1), # fourth layer
        nn.ReLU(),
        nn.MaxPool2d(2),
        nn.Flatten(), # flatten the layer. Takes 3d into 1d
        nn.Linear(256 * 8 * 8, 1024), # output 1024 neurons. Expecting 65,536 features. (total number of input features(last conv layer's channels * remaining image resolution))
        nn.ReLU(),
        nn.Linear(1024, 512), # output 512 neurons. Expecting 65,536 features. (total number of input features(last conv layer's channels * remaining image resolution))
        nn.ReLU(),
        nn.Dropout(0.3), # randomly turns off 30% of neurons during training to prevent the model from "memorizing" the data (overfitting)
        nn.Linear(512, 4) # 4 because we have 4 classes
    )


if __name__ == "__main__":
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using {device} device")

    tf = transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.ToTensor(),
        transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]) # for mean and std
    ])

    # take the training folder, treat the sub folders as classes and turn it into a dataset
    train_dl = DataLoader(
        datasets.ImageFolder("data/Training", tf),
        batch_size=64, # 32 images at once
        shuffle=True, # shuffle training data for randomness
        num_workers=3, # speeds loading of data if > 0. If set > 0, need to use if __name__ == "__main__".
        pin_memory=True, # speeds up transfer between gpu and cpu
        persistent_workers=True # keeps workers alive between epochs instead of killing and recreating them
    )

    test_dl = DataLoader(
        datasets.ImageFolder("data/Testing", tf),
        batch_size=64, # 32 images at once
        shuffle=False, # doesn't matter what order we do testing
        num_workers=3,
        pin_memory=True, # speeds up transfer between gpu and cpu
    )

    model = getModel().to(device)

    opt = optim.AdamW(model.parameters(), 1e-3)
    loss_fn = nn.CrossEntropyLoss()

    # put into training mode
    model.train()
    for epoch in range(40): # go through the entire dataset 25 times
        running_loss = 0

        # x contains images 1-32. y contains labels 1-32.
        for x, y in train_dl: # since batch_size=32, for every epoch, DataLoaders grabs 32 random images and 32 corresponding labels. It then repeats this until the whole dataset is exhausted.
            opt.zero_grad() # clears the slate to prevent mixing mistakes from previous batch to current batch

            # model makes a prediction, then the loss_fun calcaultes how "wrong" the model was compared to the true label
            loss = loss_fn(model(x.to(device)), y.to(device)) # move the data to the gpu
            loss.backward() # backpropagation. "learning" step.

            running_loss += loss.item() # item() extracts the float and "breaks the chain" of the mathematical history connected to loss

            opt.step() # optimizes so that the loss will be smaller next epoch

        print(f"Epoch {epoch+1}: Loss was {running_loss}")

    # put into eval mode
    model.eval()
    test_loss, correct = 0.0, 0

    # torch.no_grad() tells the engine to stop keeping track of math history
    with torch.no_grad():
        for x, y in test_dl:
            x, y = x.to(device), y.to(device)
            
            logits = model(x)
            test_loss += loss_fn(logits, y).item() * y.size(0)

            preds = logits.argmax(dim=1) # dim=1 finds the index of the highest score across the classes (columns) for each image. Creates a list of 32 predictions for the current batch
            correct += (preds == y).sum().item() # compares preds to y (true labels). Creates a list of True/False values. sum() counts how many are True.
    
    test_loss /= len(test_dl.dataset)
    accuracy = 100.0 * correct / len(test_dl.dataset)

    print("Test Loss:", test_loss, "Test Accuracy", accuracy, "%")

    model.eval()

    idx = random.randrange(len(test_dl.dataset))
    img, label = test_dl.dataset[idx]

    # make a prediction
    with torch.no_grad():
        logits = model(img.unsqueeze(0).to(device)) # unsqueeze(0) because the model expects a batch of images, but we are testing just one image. Model recognizes it as a batch of 1
        pred = logits.argmax(1).item() # logits are raw scores the model outputs, they are high or low numbers. It then finds the index of the highest one from the four classes.
    
    class_names = test_dl.dataset.classes
    print(f"Predicted class: {class_names[pred]}")
    print(f"Ground-truth: {class_names[label]}")

    # show image
    unnorm = img * 0.5 + 0.5 # unnormalize image. transform it back so that we can show it
    plt.imshow(to_pil_image(unnorm))
    plt.axis("off")
    plt.title("Sample from test set")
    plt.show()
