for row in range(10):
    for col in range(4):
        centerx = 14.05 + (col * 3)
        centery = 12 - (row * 3)
        out = f"row:  {row} col: {col} center: {centerx}, {centery}"
        print(out)
