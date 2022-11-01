import sys
import pygame
from bullet import Bullet


def check_events(ai_settings, screen, ship, bullets):
  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      sys.exit()
    elif event.type == pygame.KEYDOWN:
      if event.key == pygame.K_q:
        sys.exit()
      else:
        check_keydown_events(event, ai_settings, screen, ship, bullets)
    elif event.type == pygame.KEYUP:
      check_keyup_events(event, ship)
  
    
def check_keydown_events(event, ai_settings, screen, ship, bullets):
  if event.key == pygame.K_SPACE:
    fire_bullet(ai_settings, screen,ship, bullets)
  elif event.key == pygame.K_RIGHT:
    #向右移动飞船
    ship.moving_right = True
    ship.moving_lefe = False
  elif event.key == pygame.K_LEFT:
    #向左移动飞船
    ship.moving_right = False
    ship.moving_left = True

def fire_bullet(ai_settings, screen, ship, bullets):
  if len(bullets) < ai_settings.bullets_allowed:
    current_bullet = Bullet(ai_settings, screen, ship)
    bullets.add(current_bullet)

def check_keyup_events(event, ship):
  if event.key == pygame.K_RIGHT:
    ship.moving_right = False
  if event.key == pygame.K_LEFT:
    #向左移动飞船
    ship.moving_left = False

def update_bullets(bullets):
  bullets.update()
  for bullet in bullets.copy():
      if bullet.rect.bottom <= 0:
        bullets.remove(bullet)

def update_screen(ai_setting, screen, ship, bullets, alien):
  screen.fill(ai_setting.bg_color)
  ship.blitme()
  alien.blitme()

  for bullet in bullets:
    bullet.draw_bullet()

  pygame.display.flip()