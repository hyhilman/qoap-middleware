Feature: Websocket pub/sub
  As a Websocket developer
  In order to communicate with my "things"
  I want to subscribe and publish to topics

  Scenario: Receiving message from CoAP
    Given client "A" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "hello world" to "foobar" via COAP
    Then client "A" should have received "hello world" from "foobar" via WEBSOCKET

  Scenario: Receiving message from MQTT
    Given client "A" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "hello world" to "foobar" via MQTT
    Then client "A" should have received "hello world" from "foobar" via WEBSOCKET