Feature: Publish and subcribe through a topic
  As an IoT developer
  In order to communicate with my "things"
  I want to subscribe and publish to topics

    Scenario: [MD_001] Receiving message from CoAP (NON)
    Given client "A" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via COAP with QoS 0
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET

  Scenario: [MD_002]Receiving message from CoAP (CON)
    Given client "A" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via COAP with QoS 1
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET

  Scenario: [MD_003] Receiving message from CoAP (CON) packet with two applications 
    Given client "A" subscribe to "foobar" via WEBSOCKET
      And client "C" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via COAP with QoS 1
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET
      And client "C" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET

  Scenario: [MD_004] Receiving message from MQTT (QoS 0)
    Given client "A" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via MQTT with QoS 0
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET

  Scenario: [MD_005] Receiving message from MQTT (QoS 1)
    Given client "A" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via MQTT with QoS 1
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET

  Scenario: [MD_006] Receiving message from MQTT (QoS 2)
    Given client "A" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via MQTT with QoS 2
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET

  Scenario: [MD_007] Receiving message from MQTT (QoS 1) with two applications
    Given client "A" subscribe to "foobar" via WEBSOCKET
      And client "C" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via MQTT with QoS 1
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET
      And client "C" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET

  Scenario: [MD_008] Receiving message from CoAP (CON) and MQTT (QoS 1)
    Given client "A" subscribe to "foobar" via WEBSOCKET
      And client "B" subscribe to "foobaz" via WEBSOCKET
    When client "C" publishes "{'foo':'bar'}" to "foobar" via COAP with QoS 1
      And client "D" publishes "{'foo':'baz'}" to "foobaz" via MQTT with QoS 1
    Then client "A" should have received "{'foo':'bar'}" from "foobar" via WEBSOCKET
      And client "B" should have received "{'foo':'baz'}" from "foobaz" via WEBSOCKET

  Scenario: [MD_009] Receiving message from CoAP (CON) and MQTT (QoS 1) (Override)
    Given client "A" subscribe to "foobar" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foobar" via COAP with QoS 1
      And client "B" publishes "{'foo':'baz'}" to "foobar" via MQTT with QoS 1
    Then client "A" should have received "{'foo':'baz'}" from "foobar" via WEBSOCKET

  Scenario: [MD_010] Receiving plain text message with pattern
    Given client "A" subscribe to "foo/*" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foo/bar" via MQTT with QoS 1
    Then client "A" should have received "{'foo':'bar'}" from "foo/bar" via WEBSOCKET

  Scenario: [MD_011] Receiving plain text message with pattern
    Given client "A" subscribe to "foo/#" via WEBSOCKET
    When client "B" publishes "{'foo':'bar'}" to "foo/bar" via MQTT with QoS 1
    Then client "A" should have received "{'foo':'bar'}" from "foo/bar" via WEBSOCKET