import sys
import pygame

def check_events(ship):
  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      sys.exit()
    elif event.type == pygame.KEYDOWN:
      check_keydown_events(event, ship)
    elif event.type == pygame.KEYUP:
      check_keyup_events(event, ship)
    
def check_keydown_events(event, ship):
  if event.key == pygame.K_RIGHT:
    #向右移动飞船
    ship.moving_right = True
    ship.moving_lefe = False
  if event.key == pygame.K_LEFT:
    #向左移动飞船
    ship.moving_right = False
    ship.moving_left = True

def check_keyup_events(event, ship):
  if event.key == pygame.K_RIGHT:
    ship.moving_right = False
  if event.key == pygame.K_LEFT:
    #向左移动飞船
    ship.moving_left = False

def update_screen(ai_setting, screen, ship):
  screen.fill(ai_setting.bg_color)
  ship.blitme()

  pygame.display.flip()