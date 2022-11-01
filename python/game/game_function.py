import sys
import pygame

def check_events(ship):
  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      sys.exit()
    elif event.type == pygame.KEYDOWN:
      if event.key == pygame.K_RIGHT:
        #向右移动飞船
        ship.rect.centerx += 1
      if event.key == pygame.K_LEFT:
        #向左移动飞船
        ship.rect.centerx -= 1
    
def update_screen(ai_setting, screen, ship):
  screen.fill(ai_setting.bg_color)
  ship.blitme()

  pygame.display.flip()